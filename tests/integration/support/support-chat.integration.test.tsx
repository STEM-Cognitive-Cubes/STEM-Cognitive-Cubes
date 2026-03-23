import { fireEvent, render, waitFor } from "@testing-library/react-native";

import ChatScreen from "@/features/settings/helpAndSupport/liveChat";

import {
  cleanupIntegrationTestEnv,
  clearIntegrationState,
  createSignedInUser,
  readCollection,
} from "../helpers/firebaseEmulator";

describe("support live chat integration", () => {
  beforeEach(async () => {
    await clearIntegrationState();
  });

  afterAll(async () => {
    await cleanupIntegrationTestEnv();
  });

  it("seeds the initial support greeting and persists both user and support reply messages", async () => {
    const email = `support-chat-${Date.now()}@blokc.test`;
    const user = await createSignedInUser(email, "SupportPass123!");
    const navigation = {
      goBack: jest.fn(),
    };
    const route = {
      key: "ChatScreen-test",
      name: "ChatScreen",
    };

    const screen = render(
      <ChatScreen navigation={navigation as never} route={route as never} />
    );

    expect(
      await screen.findByText(
        "Hello. Tell us what issue you hit while using the app."
      )
    ).toBeTruthy();

    fireEvent.changeText(
      screen.getByTestId("support-chat-input"),
      "The cubes disconnected during play."
    );
    fireEvent.press(screen.getByTestId("support-chat-send-button"));

    expect(
      await screen.findByText(
        "Thanks for reaching out. Our support team has received your message and will follow up shortly."
      )
    ).toBeTruthy();

    const messages = await readCollection(["users", user.uid, "supportChatMessages"]);

    expect(messages).toHaveLength(3);
    expect(messages.map((message) => message.body)).toEqual(
      expect.arrayContaining([
        "Hello. Tell us what issue you hit while using the app.",
        "The cubes disconnected during play.",
        "Thanks for reaching out. Our support team has received your message and will follow up shortly.",
      ])
    );

    await waitFor(() => {
      expect(messages.map((message) => message.sender)).toEqual(
        expect.arrayContaining(["Support", "You"])
      );
    });
  });
});
