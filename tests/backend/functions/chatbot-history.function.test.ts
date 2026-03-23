import {
  callFunction,
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  getCurrentUserToken,
  seedDocument,
} from "../helpers/backendEmulator";

describe("chatbotHistory function backend behavior", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("rejects requests that do not include an authenticated bearer token", async () => {
    const response = await callFunction("chatbotHistory");

    expect(response.status).toBe(401);
    expect(response.json).toEqual({
      error: "Your session expired. Please sign in again.",
    });
  });

  it("rejects unsupported HTTP methods", async () => {
    const response = await callFunction("chatbotHistory", {
      method: "POST",
    });

    expect(response.status).toBe(405);
    expect(response.json).toEqual({ error: "Method not allowed" });
  });

  it("returns an empty but valid history shape when the user has no conversations", async () => {
    await createSignedInUser("backend-chat-history-empty@example.com", "Password123!");
    const token = await getCurrentUserToken();

    const response = await callFunction("chatbotHistory", {
      token,
    });

    expect(response.status).toBe(200);
    expect(response.json).toEqual({
      conversationId: null,
      messages: [],
    });
  });

  it("returns the latest stored conversation with the expected message shape", async () => {
    const user = await createSignedInUser("backend-chat-history-filled@example.com", "Password123!");
    const token = await getCurrentUserToken();

    await seedDocument(["users", user.uid, "chatConversations", "conv-1"], {
      title: "Latest conversation",
      updatedAt: new Date("2026-03-23T10:00:00.000Z"),
    });
    await seedDocument(["users", user.uid, "chatConversations", "conv-1", "messages", "m-1"], {
      role: "user",
      text: "Hello",
      sources: [],
      createdAt: new Date("2026-03-23T10:00:01.000Z"),
    });
    await seedDocument(["users", user.uid, "chatConversations", "conv-1", "messages", "m-2"], {
      role: "assistant",
      text: "Hi there",
      sources: ["Guide"],
      createdAt: new Date("2026-03-23T10:00:02.000Z"),
    });

    const response = await callFunction("chatbotHistory", {
      token,
    });

    expect(response.status).toBe(200);
    expect(response.json).toEqual({
      conversationId: "conv-1",
      messages: [
        {
          id: "m-1",
          role: "user",
          text: "Hello",
          sources: [],
        },
        {
          id: "m-2",
          role: "assistant",
          text: "Hi there",
          sources: ["Guide"],
        },
      ],
    });
  });
});
