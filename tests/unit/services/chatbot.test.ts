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
import { sendChatMessage } from "@/services/chatbot";

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
});
