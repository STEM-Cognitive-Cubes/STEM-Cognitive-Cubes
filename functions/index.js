const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const { fallbackProductContext } = require("./productContext");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const DEFAULT_MODEL = "gpt-4.1-mini";
const SUPPORT_FALLBACK_REPLY =
  "I am not fully sure about that yet. Please check the relevant app screen or contact support if the issue continues.";

function setCors(res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function chunkText(value, maxLength = 1200) {
  return cleanText(value).slice(0, maxLength);
}

function getOpenAiConfig() {
  const apiKey = cleanText(process.env.OPENAI_API_KEY);
  const model = cleanText(process.env.OPENAI_MODEL) || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY secret");
  }

  return { apiKey, model };
}

function getRequestErrorMessage(status) {
  if (status === 401) {
    return "Your session expired. Please sign in again.";
  }

  if (status === 502) {
    return "The assistant is temporarily unavailable. Please try again.";
  }

  return "The assistant could not handle that request right now.";
}

function extractOutputText(responseJson) {
  if (typeof responseJson?.output_text === "string" && responseJson.output_text.trim()) {
    return responseJson.output_text.trim();
  }

  const output = Array.isArray(responseJson?.output) ? responseJson.output : [];
  const parts = [];

  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const entry of content) {
      const text = cleanText(entry?.text ?? entry?.value);
      if (
        text &&
        (entry?.type === "output_text" ||
          entry?.type === "text" ||
          item?.type === "message")
      ) {
        parts.push(text);
      }
    }
  }

  return parts.join("\n\n").trim();
}

function scoreKnowledgeItem(item, query) {
  const haystack = `${item.title} ${item.content} ${(item.keywords || []).join(" ")}`.toLowerCase();
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

  let score = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) {
      score += 1;
    }
  }

  return score;
}

async function getKnowledgeContext(message) {
  try {
    const snapshot = await db.collection("botKnowledge").limit(20).get();
    const knowledge = snapshot.docs
      .map((doc) => {
        const data = doc.data() || {};
        return {
          id: doc.id,
          title: cleanText(data.title),
          content: cleanText(data.content),
          keywords: Array.isArray(data.keywords) ? data.keywords : [],
        };
      })
      .filter((item) => item.title || item.content);

    const ranked = knowledge
      .map((item) => ({
        ...item,
        score: scoreKnowledgeItem(item, message),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (!ranked.length || ranked.every((item) => item.score === 0)) {
      return {
        context: fallbackProductContext,
        sources: [],
      };
    }

    const context = [
      fallbackProductContext,
      "Relevant product knowledge:",
      ...ranked.map(
        (item) =>
          `Title: ${item.title || "Untitled"}\nContent: ${chunkText(item.content, 1500)}`
      ),
    ].join("\n\n");

    return {
      context,
      sources: ranked.map((item) => item.title || item.id),
    };
  } catch (error) {
    logger.error("Failed to load knowledge context", error);
    return {
      context: fallbackProductContext,
      sources: [],
    };
  }
}

async function verifyUser(req) {
  const authHeader = cleanText(req.headers.authorization);
  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Missing bearer token");
  }

  const token = authHeader.replace(/^Bearer\s+/i, "");
  return admin.auth().verifyIdToken(token);
}

async function getConversationRef(uid, incomingConversationId, firstMessage) {
  const userRef = db.collection("users").doc(uid);
  const conversationsRef = userRef.collection("chatConversations");
  const conversationId = cleanText(incomingConversationId);

  if (conversationId) {
    return conversationsRef.doc(conversationId);
  }

  const newConversationRef = conversationsRef.doc();
  await newConversationRef.set(
    {
      title: chunkText(firstMessage, 60) || "New conversation",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      messageCount: 0,
      lastUserMessage: chunkText(firstMessage, 120),
    },
    { merge: true }
  );
  return newConversationRef;
}

async function getRecentMessages(conversationRef) {
  const snapshot = await conversationRef
    .collection("messages")
    .orderBy("createdAt", "desc")
    .limit(12)
    .get();

  return snapshot.docs
    .map((doc) => doc.data())
    .filter((item) => item?.role && item?.text)
    .reverse();
}

function mapStoredMessage(doc) {
  const data = doc.data() || {};

  return {
    id: doc.id,
    role: data.role,
    text: data.text,
    sources: Array.isArray(data.sources) ? data.sources : [],
  };
}

async function saveMessage(conversationRef, role, text, options = {}) {
  await conversationRef.collection("messages").add({
    role,
    text: chunkText(text, 4000),
    sources: Array.isArray(options.sources) ? options.sources : [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function updateConversationSummary(conversationRef, userMessage, assistantReply) {
  await conversationRef.set(
    {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUserMessage: chunkText(userMessage, 120),
      lastAssistantMessage: chunkText(assistantReply, 200),
      messageCount: admin.firestore.FieldValue.increment(2),
    },
    { merge: true }
  );
}

async function requestModelReply({ apiKey, model, input }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        input,
      }),
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

exports.chatbotHistory = onRequest(
  {
    region: "us-central1",
    cors: false,
  },
  async (req, res) => {
    setCors(res);

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const decodedToken = await verifyUser(req);
      const requestedConversationId = cleanText(req.query?.conversationId);
      const conversationsRef = db
        .collection("users")
        .doc(decodedToken.uid)
        .collection("chatConversations");

      let conversationRef;

      if (requestedConversationId) {
        conversationRef = conversationsRef.doc(requestedConversationId);
      } else {
        const latestConversationSnapshot = await conversationsRef
          .orderBy("updatedAt", "desc")
          .limit(1)
          .get();

        if (latestConversationSnapshot.empty) {
          res.status(200).json({
            conversationId: null,
            messages: [],
          });
          return;
        }

        conversationRef = latestConversationSnapshot.docs[0].ref;
      }

      const conversationSnapshot = await conversationRef.get();
      if (!conversationSnapshot.exists) {
        res.status(404).json({ error: "Conversation not found" });
        return;
      }

      const messagesSnapshot = await conversationRef
        .collection("messages")
        .orderBy("createdAt", "asc")
        .limit(20)
        .get();

      const messages = messagesSnapshot.docs
        .map(mapStoredMessage)
        .filter((item) => item.role && item.text);

      res.status(200).json({
        conversationId: conversationRef.id,
        messages,
      });
    } catch (error) {
      logger.error("chatbotHistory function failed", error);
      const message =
        error instanceof Error ? error.message : "Unknown server error";
      const status = message === "Missing bearer token" ? 401 : 500;
      res.status(status).json({ error: getRequestErrorMessage(status) });
    }
  }
);

exports.chatbot = onRequest(
  {
    region: "us-central1",
    cors: false,
    secrets: ["OPENAI_API_KEY"],
  },
  async (req, res) => {
    setCors(res);

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const { apiKey, model } = getOpenAiConfig();
      const decodedToken = await verifyUser(req);
      const message = cleanText(req.body?.message);
      const conversationId = cleanText(req.body?.conversationId);

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      if (message.length > 2000) {
        res.status(400).json({ error: "Message is too long" });
        return;
      }

      const conversationRef = await getConversationRef(
        decodedToken.uid,
        conversationId,
        message
      );

      const [history, knowledge] = await Promise.all([
        getRecentMessages(conversationRef),
        getKnowledgeContext(message),
      ]);

      const input = [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "You are the BlokC in-app assistant.",
                "Answer using the provided product context first.",
                "Do not invent features or unsupported troubleshooting steps.",
                "If the answer is uncertain, say what is known and suggest support.",
                "Keep answers concise, practical, and easy for app users to follow.",
                knowledge.context,
              ].join("\n\n"),
            },
          ],
        },
        ...history.map((item) => ({
          role: item.role === "assistant" ? "assistant" : "user",
          content: [
            {
              type: "input_text",
              text: chunkText(item.text, 2000),
            },
          ],
        })),
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: message,
            },
          ],
        },
      ];

      const openAiResponse = await requestModelReply({
        apiKey,
        model,
        input,
      });

      if (!openAiResponse.ok) {
        const errorText = await openAiResponse.text();
        logger.error("OpenAI request failed", {
          status: openAiResponse.status,
          body: errorText,
        });
        res.status(502).json({ error: "Chat provider request failed" });
        return;
      }

      const responseJson = await openAiResponse.json();
      const reply =
        extractOutputText(responseJson) || SUPPORT_FALLBACK_REPLY;

      await Promise.all([
        saveMessage(conversationRef, "user", message),
        saveMessage(conversationRef, "assistant", reply, {
          sources: knowledge.sources,
        }),
        updateConversationSummary(conversationRef, message, reply),
      ]);

      res.status(200).json({
        conversationId: conversationRef.id,
        reply,
        sources: knowledge.sources,
        model: responseJson.model || model,
      });
    } catch (error) {
      logger.error("chatbot function failed", error);
      const message =
        error instanceof Error ? error.message : "Unknown server error";
      const status =
        message === "Missing bearer token"
          ? 401
          : message === "Missing OPENAI_API_KEY secret"
            ? 500
            : 502;
      res.status(status).json({ error: getRequestErrorMessage(status) });
    }
  }
);
