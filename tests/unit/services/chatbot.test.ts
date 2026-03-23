jest.mock("expo-constants", () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        API_BASE_URL: "https://api.example.com///",
      },
    },
  },
}));

jest.mock("@/services/firebase", () => ({
  auth: {
    currentUser: null,
  },
}));

import { auth } from "@/services/firebase";
import { fetchChatHistory, sendChatMessage } from "@/services/chatbot";

describe("chatbot service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    (global.fetch as jest.Mock | undefined) = jest.fn();
  });

  it("sends chatbot requests with auth header and normalized base URL", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        conversationId: "conv-1",
        reply: "Hello there",
        sources: ["doc-1"],
        model: "gpt-test",
      }),
    });

    const result = await sendChatMessage("Hi bot", "conv-0");

    expect(getIdToken).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.example.com/chatbot",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer token-123",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          message: "Hi bot",
          conversationId: "conv-0",
        }),
      })
    );
    expect(result).toEqual({
      conversationId: "conv-1",
      reply: "Hello there",
      sources: ["doc-1"],
      model: "gpt-test",
    });
  });

  it("normalizes chatbot response when sources/model are missing", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        conversationId: "conv-2",
        reply: "Fallback fields",
      }),
    });

    const result = await sendChatMessage("Hi");

    expect(result).toEqual({
      conversationId: "conv-2",
      reply: "Fallback fields",
      sources: [],
      model: "unknown",
    });
  });

  it("normalizes fetchChatHistory payload when fields are malformed", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        conversationId: 12345,
        messages: "not-an-array",
      }),
    });

    const result = await fetchChatHistory();

    expect(result).toEqual({
      conversationId: undefined,
      messages: [],
    });
  });

  it("throws when current user is missing", async () => {
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      null;

    await expect(sendChatMessage("Hi")).rejects.toThrow(
      "You must be signed in to use the assistant."
    );
  });

  it("maps network failures to a device-reachability message", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    (global.fetch as jest.Mock).mockRejectedValue(
      new Error("Network request failed")
    );

    await expect(sendChatMessage("Hi")).rejects.toThrow(
      "The assistant server is not reachable from this device. Check your API_BASE_URL, Wi-Fi, and emulator host settings."
    );
  });

  it("maps timeout aborts to the assistant timeout message", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    const abortError = new Error("aborted");
    abortError.name = "AbortError";
    (global.fetch as jest.Mock).mockRejectedValue(abortError);

    await expect(sendChatMessage("Hi")).rejects.toThrow(
      "The assistant server did not respond. Check that the Firebase emulator is running and reachable from your phone."
    );
  });

  it("throws backend-provided history errors when response is not ok", async () => {
    const getIdToken = jest.fn().mockResolvedValue("token-123");
    (auth as { currentUser: { getIdToken: () => Promise<string> } | null }).currentUser =
      {
        getIdToken,
      };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "History unavailable",
      }),
    });

    await expect(fetchChatHistory("conv-1")).rejects.toThrow(
      "History unavailable"
    );
  });
});
