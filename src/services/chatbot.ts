import Constants from "expo-constants";

import { auth } from "./firebase";

type ChatbotReply = {
  conversationId: string;
  reply: string;
  sources: string[];
  model: string;
};

export type ChatHistoryMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources: string[];
};

function normalizeBaseUrl(rawValue?: string) {
  const value = rawValue?.trim();
  if (!value) {
    return "http://localhost:5001/blokc-13a99/us-central1";
  }

  return value.replace(/\/+$/, "");
}

function getApiBaseUrl() {
  const expoExtra = Constants.expoConfig?.extra as
    | { API_BASE_URL?: string }
    | undefined;

  return normalizeBaseUrl(expoExtra?.API_BASE_URL);
}

async function getAuthHeaders() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in to use the assistant.");
  }

  const idToken = await user.getIdToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
}

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatbotReply> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getApiBaseUrl()}/chatbot`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      conversationId,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error || "The assistant is unavailable right now."
    );
  }

  return {
    conversationId: payload.conversationId,
    reply: payload.reply,
    sources: Array.isArray(payload.sources) ? payload.sources : [],
    model: payload.model || "unknown",
  };
}

export async function fetchChatHistory(conversationId?: string) {
  const headers = await getAuthHeaders();
  const url = new URL(`${getApiBaseUrl()}/chatbotHistory`);

  if (conversationId) {
    url.searchParams.set("conversationId", conversationId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.error || "Could not load assistant history right now."
    );
  }

  return {
    conversationId:
      typeof payload?.conversationId === "string"
        ? payload.conversationId
        : undefined,
    messages: Array.isArray(payload?.messages)
      ? (payload.messages as ChatHistoryMessage[])
      : [],
  };
}
