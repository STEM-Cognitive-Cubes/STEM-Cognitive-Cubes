import Constants from "expo-constants";

import { auth } from "./firebase";

type ChatbotReply = {
  conversationId: string;
  reply: string;
  sources: string[];
  model: string;
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

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatbotReply> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be signed in to use the assistant.");
  }

  const idToken = await user.getIdToken();
  const response = await fetch(`${getApiBaseUrl()}/chatbot`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
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
