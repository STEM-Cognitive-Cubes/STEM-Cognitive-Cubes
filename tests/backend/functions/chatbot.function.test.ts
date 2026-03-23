import {
  callFunction,
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  getCurrentUserToken,
} from "../helpers/backendEmulator";

describe("chatbot function backend validation", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("rejects unauthenticated requests", async () => {
    const response = await callFunction("chatbot", {
      method: "POST",
      body: { message: "Hello" },
    });

    expect(response.status).toBe(401);
    expect(response.json).toEqual({
      error: "Your session expired. Please sign in again.",
    });
  });

  it("rejects unsupported HTTP methods", async () => {
    const response = await callFunction("chatbot", {
      method: "GET",
    });

    expect(response.status).toBe(405);
    expect(response.json).toEqual({ error: "Method not allowed" });
  });

  it("rejects requests with a missing message", async () => {
    await createSignedInUser("backend-chatbot-missing@example.com", "Password123!");
    const token = await getCurrentUserToken();

    const response = await callFunction("chatbot", {
      method: "POST",
      token,
      body: {},
    });

    expect(response.status).toBe(400);
    expect(response.json).toEqual({ error: "Message is required" });
  });

  it("rejects messages that exceed the backend length limit", async () => {
    await createSignedInUser("backend-chatbot-toolong@example.com", "Password123!");
    const token = await getCurrentUserToken();

    const response = await callFunction("chatbot", {
      method: "POST",
      token,
      body: {
        message: "x".repeat(2001),
      },
    });

    expect(response.status).toBe(400);
    expect(response.json).toEqual({ error: "Message is too long" });
  });
});
