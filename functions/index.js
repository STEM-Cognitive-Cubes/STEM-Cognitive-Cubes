const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const { randomUUID } = require("crypto");

const { fallbackProductContext } = require("./productContext");

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const DEFAULT_MODEL = "gemini-2.5-flash";
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

function getGeminiConfig() {
  const apiKey = cleanText(process.env.GEMINI_API_KEY);
  const model = cleanText(process.env.GEMINI_MODEL) || DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY secret");
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
  const candidates = Array.isArray(responseJson?.candidates)
    ? responseJson.candidates
    : [];
  const firstCandidate = candidates[0];
  const parts = Array.isArray(firstCandidate?.content?.parts)
    ? firstCandidate.content.parts
    : [];

  return parts
    .map((part) => cleanText(part?.text))
    .filter(Boolean)
    .join("\n\n")
    .trim();
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
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
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
    createdAt: FieldValue.serverTimestamp(),
  });
}

async function updateConversationSummary(conversationRef, userMessage, assistantReply) {
  await conversationRef.set(
    {
      updatedAt: FieldValue.serverTimestamp(),
      lastUserMessage: chunkText(userMessage, 120),
      lastAssistantMessage: chunkText(assistantReply, 200),
      messageCount: FieldValue.increment(2),
    },
    { merge: true }
  );
}

function buildGeminiContents(history, message) {
  return [
    ...history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: chunkText(item.text, 2000),
        },
      ],
    })),
    {
      role: "user",
      parts: [
        {
          text: message,
        },
      ],
    },
  ];
}

async function requestModelReply({ apiKey, model, history, message, systemInstruction }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: systemInstruction,
            },
          ],
        },
        contents: buildGeminiContents(history, message),
      }),
      signal: controller.signal,
      }
    );

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
    secrets: ["GEMINI_API_KEY"],
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
      const { apiKey, model } = getGeminiConfig();
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

      const systemInstruction = [
        "You are the BlokC in-app assistant.",
        "Answer using the provided product context first.",
        "Do not invent features or unsupported troubleshooting steps.",
        "If the answer is uncertain, say what is known and suggest support.",
        "Keep answers concise, practical, and easy for app users to follow.",
        knowledge.context,
      ].join("\n\n");

      const geminiResponse = await requestModelReply({
        apiKey,
        model,
        history,
        message,
        systemInstruction,
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        logger.error("Gemini request failed", {
          status: geminiResponse.status,
          body: errorText,
        });
        res.status(502).json({ error: "Chat provider request failed" });
        return;
      }

      const responseJson = await geminiResponse.json();
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
          : message === "Missing GEMINI_API_KEY secret"
            ? 500
            : 502;
      res.status(status).json({ error: getRequestErrorMessage(status) });
    }
  }
);

function toFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function toFiniteInteger(value, fallback = null) {
  const numeric = toFiniteNumber(value);
  if (numeric === null) {
    return fallback;
  }
  return Math.trunc(numeric);
}

function normalizeEdgeEvent(rawEvent) {
  const raw = rawEvent || {};
  const type = cleanText(raw.type || raw.event).toLowerCase();
  const t = toFiniteNumber(raw.t ?? raw.ts);
  const cubeA = cleanText(raw.cubeA || raw.a);
  const cubeB = cleanText(raw.cubeB || raw.b);
  const faceA = toFiniteInteger(raw.faceA ?? raw.fa, 0);
  const faceB = toFiniteInteger(raw.faceB ?? raw.fb, 0);

  if (!type || (type !== "connect" && type !== "disconnect")) {
    return null;
  }

  if (t === null || t < 0) {
    return null;
  }

  if (!cubeA || !cubeB) {
    return null;
  }

  return {
    t,
    type,
    cubeA,
    faceA: Math.max(0, faceA || 0),
    cubeB,
    faceB: Math.max(0, faceB || 0),
  };
}

function normalizeEdgeEvents(rawEvents) {
  const source = Array.isArray(rawEvents) ? rawEvents : [];
  const normalized = [];
  let invalidCount = 0;

  for (const rawEvent of source) {
    const event = normalizeEdgeEvent(rawEvent);
    if (!event) {
      invalidCount += 1;
      continue;
    }
    normalized.push(event);
  }

  normalized.sort((a, b) => a.t - b.t);

  return {
    events: normalized,
    invalidCount,
  };
}

function buildPlaybackArtifact(sessionId, events) {
  const durationMs = events.length ? events[events.length - 1].t : 0;

  return {
    sessionId,
    generatedAt: new Date().toISOString(),
    durationMs,
    eventCount: events.length,
    events,
  };
}

async function persistManualEdgeEvents(sessionRef, events) {
  if (!events.length) {
    return;
  }

  const existingEvents = await sessionRef.collection("edgeEvents").limit(1).get();
  if (!existingEvents.empty) {
    return;
  }

  const batch = db.batch();
  events.forEach((event, index) => {
    const eventRef = sessionRef.collection("edgeEvents").doc(`${String(index).padStart(6, "0")}`);
    batch.set(eventRef, {
      session_id: sessionRef.id,
      ts: event.t,
      event: event.type,
      a: event.cubeA,
      fa: event.faceA,
      b: event.cubeB,
      fb: event.faceB,
      source: "manual_finalize_payload",
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  await batch.commit();
}

async function writePlaybackArtifact(sessionId, artifact) {
  const bucket = admin.storage().bucket();
  const filePath = `sessions/${sessionId}/session.json`;
  const file = bucket.file(filePath);
  const downloadToken = randomUUID();

  await file.save(JSON.stringify(artifact, null, 2), {
    contentType: "application/json",
    resumable: false,
    metadata: {
      cacheControl: "private,max-age=0,no-cache",
      metadata: {
        firebaseStorageDownloadTokens: downloadToken,
      },
    },
  });

  const tokenUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${encodeURIComponent(downloadToken)}`;

  let signedUrl = "";
  try {
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });
    signedUrl = url;
  } catch (error) {
    logger.warn("Could not create signed playback URL, falling back to token URL", error);
  }

  return {
    filePath,
    signedUrl: signedUrl || tokenUrl,
  };
}

exports.finalizeSession = onRequest(
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

    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    try {
      const decodedToken = await verifyUser(req);
      const sessionId = cleanText(req.body?.sessionId);
      const childId = cleanText(req.body?.childId);
      const requestedDurationSeconds = toFiniteInteger(req.body?.durationSeconds, null);

      if (!sessionId) {
        res.status(400).json({ error: "sessionId is required" });
        return;
      }

      const sessionRef = db.collection("playSessions").doc(sessionId);
      const sessionSnapshot = await sessionRef.get();
      const existingSession = sessionSnapshot.exists ? sessionSnapshot.data() || {} : {};

      if (
        sessionSnapshot.exists &&
        cleanText(existingSession.parentId) &&
        cleanText(existingSession.parentId) !== decodedToken.uid
      ) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      const edgeEventsSnapshot = await sessionRef
        .collection("edgeEvents")
        .orderBy("ts", "asc")
        .get();

      let rawEvents = [];
      let source = "request_payload";
      if (!edgeEventsSnapshot.empty) {
        rawEvents = edgeEventsSnapshot.docs.map((doc) => doc.data());
        source = "firestore_edge_events";
      } else if (Array.isArray(req.body?.events)) {
        rawEvents = req.body.events;
      }

      const { events, invalidCount } = normalizeEdgeEvents(rawEvents);
      await persistManualEdgeEvents(sessionRef, events);

      const artifact = buildPlaybackArtifact(sessionId, events);
      const { filePath: playbackJsonPath, signedUrl: playbackJsonUrl } =
        await writePlaybackArtifact(sessionId, artifact);

      const durationSeconds =
        requestedDurationSeconds !== null && requestedDurationSeconds >= 0
          ? requestedDurationSeconds
          : Math.ceil(artifact.durationMs / 1000);

      const sessionUpdate = {
        parentId: decodedToken.uid,
        status: "ended",
        source: cleanText(existingSession.source) || "manual_finalize",
        updatedAt: FieldValue.serverTimestamp(),
        endedAt: FieldValue.serverTimestamp(),
        durationSeconds,
        eventCount: artifact.eventCount,
        playbackDurationMs: artifact.durationMs,
        playbackJsonPath,
        playbackJsonUrl,
        playbackSchemaVersion: 1,
      };

      if (childId) {
        sessionUpdate.childId = childId;
      } else if (cleanText(existingSession.childId)) {
        sessionUpdate.childId = cleanText(existingSession.childId);
      }

      if (!existingSession.startedAt) {
        sessionUpdate.startedAt = FieldValue.serverTimestamp();
      }

      const latestEvent = artifact.events[artifact.events.length - 1];
      if (latestEvent) {
        sessionUpdate.preview = {
          lastEventType: latestEvent.type,
          lastPair: `${latestEvent.cubeA}-${latestEvent.cubeB}`,
          blocksTouched: Array.from(
            new Set(artifact.events.flatMap((event) => [event.cubeA, event.cubeB]))
          ).length,
        };
      }

      await sessionRef.set(sessionUpdate, { merge: true });

      const latestEndedSessionRef = db
        .collection("parents")
        .doc(decodedToken.uid)
        .collection("sessionMeta")
        .doc("latestEndedSession");

      await latestEndedSessionRef.set(
        {
          sessionId,
          childId: sessionUpdate.childId || null,
          status: "ended",
          endedAt: FieldValue.serverTimestamp(),
          durationSeconds,
          eventCount: artifact.eventCount,
          playbackDurationMs: artifact.durationMs,
          playbackJsonPath,
          playbackJsonUrl,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      res.status(200).json({
        sessionId,
        source,
        eventCount: artifact.eventCount,
        invalidEventCount: invalidCount,
        durationMs: artifact.durationMs,
        playbackJsonPath,
        playbackJsonUrl,
      });
    } catch (error) {
      logger.error("finalizeSession function failed", error);
      const message =
        error instanceof Error ? error.message : "Unknown server error";
      const status = message === "Missing bearer token" ? 401 : 500;
      res.status(status).json({ error: getRequestErrorMessage(status) });
    }
  }
);
