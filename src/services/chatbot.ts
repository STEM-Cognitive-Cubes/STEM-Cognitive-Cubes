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

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs = 10000
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function getNetworkErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof Error) {
    if (error.name === "AbortError") {
      return "The assistant server did not respond. Check that the Firebase emulator is running and reachable from your phone.";
    }

    if (
      error.message.includes("Network request failed") ||
      error.message.includes("Load failed")
    ) {
      return "The assistant server is not reachable from this device. Check your API_BASE_URL, Wi-Fi, and emulator host settings.";
    }
  }

  return fallbackMessage;
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
  try {
    const response = await fetchWithTimeout(
      `${getApiBaseUrl()}/chatbot`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          message,
          conversationId,
        }),
      }
    );

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
  } catch (error) {
    throw new Error(
      getNetworkErrorMessage(
        error,
        "The assistant is unavailable right now."
      )
    );
  }
}

export async function fetchChatHistory(conversationId?: string) {
  const headers = await getAuthHeaders();
  const url = new URL(`${getApiBaseUrl()}/chatbotHistory`);

  if (conversationId) {
    url.searchParams.set("conversationId", conversationId);
  }

  try {
    const response = await fetchWithTimeout(url.toString(), {
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
  } catch (error) {
    throw new Error(
      getNetworkErrorMessage(
        error,
        "Could not load assistant history right now."
      )
    );
  }
}
