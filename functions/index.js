const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

const { fallbackProductContext } = require("./productContext");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

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

async function saveMessage(conversationRef, role, text) {
  await conversationRef.collection("messages").add({
    role,
    text: chunkText(text, 4000),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

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
      const decodedToken = await verifyUser(req);
      const message = cleanText(req.body?.message);
      const conversationId = cleanText(req.body?.conversationId);

      if (!message) {
        res.status(400).json({ error: "Message is required" });
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

      const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          input,
        }),
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
        extractOutputText(responseJson) ||
        "I could not generate a useful answer right now. Please try again.";

      await Promise.all([
        conversationRef.set(
          {
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        ),
        saveMessage(conversationRef, "user", message),
        saveMessage(conversationRef, "assistant", reply),
      ]);

      res.status(200).json({
        conversationId: conversationRef.id,
        reply,
        sources: knowledge.sources,
        model: responseJson.model || process.env.OPENAI_MODEL || "gpt-4.1-mini",
      });
    } catch (error) {
      logger.error("chatbot function failed", error);
      const message =
        error instanceof Error ? error.message : "Unknown server error";
      const status = message === "Missing bearer token" ? 401 : 500;
      res.status(status).json({ error: message });
    }
  }
);
