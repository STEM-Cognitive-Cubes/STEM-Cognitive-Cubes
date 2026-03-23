import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import BotChatScreen from "@/features/bot/screens/BotChatScreen";

const mockFetchChatHistory = jest.fn();
const mockSendChatMessage = jest.fn();

jest.mock("react-native-safe-area-context", () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));
jest.mock("@/components/BotBubbleFab", () => () => {
  const { Text } = require("react-native");
  return <Text>Bot Bubble</Text>;
});
jest.mock("@/services/chatbot", () => ({
  fetchChatHistory: () => mockFetchChatHistory(),
  sendChatMessage: (...args: unknown[]) => mockSendChatMessage(...args),
}));

describe("BotChatScreen", () => {
  beforeEach(() => {
    mockFetchChatHistory.mockReset();
    mockSendChatMessage.mockReset();
    mockFetchChatHistory.mockResolvedValue({
      conversationId: undefined,
      messages: [],
    });
    mockSendChatMessage.mockResolvedValue({
      conversationId: "conversation-1",
      reply: "Here is your answer.",
      sources: [],
    });
  });

  it("renders the main chatbot screen content", async () => {
    const { findByText, getByPlaceholderText } = render(<BotChatScreen />);

    expect(await findByText("BlokC Assistant")).toBeTruthy();
    expect(
      await findByText("Ask anything about your sessions & insights"),
    ).toBeTruthy();
    expect(await findByText("How do I connect to Hive?")).toBeTruthy();
    expect(await findByText("What are insights?")).toBeTruthy();
    expect(await findByText("How do I track rewards?")).toBeTruthy();
    expect(
      await findByText("Hi there! I'm your BlokC assistant. How can I help you today?"),
    ).toBeTruthy();
    expect(getByPlaceholderText("Ask me anything…")).toBeTruthy();
    expect(await findByText("Send")).toBeTruthy();
    expect(await findByText("Bot Bubble")).toBeTruthy();
  });

  it("sends a message and renders the bot reply", async () => {
    const { findByText, getByPlaceholderText, getByText } = render(<BotChatScreen />);

    const input = getByPlaceholderText("Ask me anything…");

    fireEvent.changeText(input, "What can you do?");
    fireEvent.press(getByText("Send"));

    expect(await findByText("What can you do?")).toBeTruthy();

    await waitFor(() => {
      expect(mockSendChatMessage).toHaveBeenCalledWith("What can you do?", undefined);
    });

    expect(await findByText("Here is your answer.")).toBeTruthy();
  });
});
