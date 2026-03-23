import React from "react";
import { render } from "@testing-library/react-native";

import HomeScreen from "@/features/home/screens/HomeScreen";

const mockNavigate = jest.fn();
const mockOnSnapshot = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}));
jest.mock("@/services/firebase", () => ({
  auth: {
    currentUser: {
      uid: "parent-1",
      displayName: "Sam Perera",
      email: "sam@example.com",
    },
  },
  db: {},
}));
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => {
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
jest.mock("react-native-svg", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    Path: () => null,
  };
});
jest.mock("@/assets/cards/historyCard.svg", () => () => null);
jest.mock("@/assets/cards/insightsCard.svg", () => () => null);
jest.mock("@/components/BotBubbleFab", () => () => {
  const { Text } = require("react-native");
  return <Text>Bot Bubble</Text>;
});

describe("HomeScreen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnSnapshot.mockReset();
    mockOnSnapshot.mockImplementation(() => jest.fn());
  });

  it("renders the main home screen content", () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText(/Hello,/)).toBeTruthy();
    expect(getByText(/Sam!/)).toBeTruthy();
    expect(getByText("Ready to track creativity?")).toBeTruthy();
    expect(getByText("Quick Actions")).toBeTruthy();
    expect(getByText("History")).toBeTruthy();
    expect(getByText("Insights")).toBeTruthy();
    expect(getByText("Start a session")).toBeTruthy();
    expect(getByText("Track Now")).toBeTruthy();
    expect(getByText("Bot Bubble")).toBeTruthy();
  });
});
