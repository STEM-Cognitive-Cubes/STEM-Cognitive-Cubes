import {
  sendSupportChatMessage,
  submitSupportEmail,
} from "@/features/settings/helpAndSupport/helpSupportService";
import {
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  readCollection,
  signOutCurrentUser,
} from "../helpers/backendEmulator";

describe("helpSupportService backend behavior", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("creates a support ticket document with the expected backend fields", async () => {
    const user = await createSignedInUser("backend-support-email@example.com", "Password123!");

    await submitSupportEmail("Need help", "Please check the latest session.");

    const tickets = await readCollection(["users", user.uid, "supportTickets"]);

    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toMatchObject({
      channel: "email",
      subject: "Need help",
      message: "Please check the latest session.",
      status: "open",
    });
    expect(tickets[0].createdAt).toBeDefined();
  });

  it("rejects support ticket submission when no authenticated user exists", async () => {
    await createSignedInUser("backend-support-auth@example.com", "Password123!");
    await signOutCurrentUser();

    await expect(
      submitSupportEmail("Need help", "Please check the latest session.")
    ).rejects.toThrow("You need to be logged in to contact support.");
  });

  it("rejects empty support chat messages and persists the user/support pair for valid messages", async () => {
    const user = await createSignedInUser("backend-support-chat@example.com", "Password123!");

    await expect(sendSupportChatMessage("    ")).rejects.toThrow(
      "Message cannot be empty."
    );

    await sendSupportChatMessage("The cube disconnected during play.");

    const messages = await readCollection(["users", user.uid, "supportChatMessages"]);

    expect(messages).toHaveLength(2);
    expect(messages.map((message) => message.sender)).toEqual(
      expect.arrayContaining(["You", "Support"])
    );
    expect(messages.map((message) => message.body)).toEqual(
      expect.arrayContaining([
        "The cube disconnected during play.",
        "Thanks for reaching out. Our support team has received your message and will follow up shortly.",
      ])
    );
  });
});
