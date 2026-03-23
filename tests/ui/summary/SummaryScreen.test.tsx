import React from "react";
import { ActivityIndicator } from "react-native";
import { render } from "@testing-library/react-native";

import SummaryScreen from "@/features/summary/SummaryScreen";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));
jest.mock("@/features/summary/SummaryCard", () => () => null);
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    childId: "child-123",
    token: "token-123",
  }),
}));

describe("SummaryScreen", () => {
  const navigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    navigation.navigate.mockClear();
    global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
  });

  it("renders the loading state while summary data is being fetched", () => {
    const { UNSAFE_getByType, getByText } = render(
      <SummaryScreen navigation={navigation as never} />,
    );

    expect(getByText("Weekly Summary")).toBeTruthy();
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });
});
