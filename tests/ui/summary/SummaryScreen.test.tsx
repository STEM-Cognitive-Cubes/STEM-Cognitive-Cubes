import React from "react";
import { ActivityIndicator } from "react-native";
import { render, waitFor } from "@testing-library/react-native";

import SummaryScreen from "@/features/summary/SummaryScreen";

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => {
    const { View } = require("react-native");
    return <View>{children}</View>;
  },
}));
jest.mock("@/features/summary/SummaryCard", () => {
  return function MockSummaryCard({
    dayLabel,
    date,
  }: {
    dayLabel: string;
    date: string;
  }) {
    const { Text, View } = require("react-native");
    return (
      <View>
        <Text>{dayLabel}</Text>
        <Text>{date}</Text>
      </View>
    );
  };
});
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

  it("renders the empty state when no weekly summaries are returned", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([]),
    }) as jest.Mock;

    const { getByText } = render(<SummaryScreen navigation={navigation as never} />);

    await waitFor(() => {
      expect(getByText("No weekly data found.")).toBeTruthy();
    });
  });

  it("renders summary cards when weekly data is returned", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        {
          id: "week-1",
          title: "Week 1",
          dateLabel: "Jan 1 - Jan 7",
        },
      ]),
    }) as jest.Mock;

    const { getByText, queryByText } = render(
      <SummaryScreen navigation={navigation as never} />,
    );

    await waitFor(() => {
      expect(getByText("Week 1")).toBeTruthy();
      expect(getByText("Jan 1 - Jan 7")).toBeTruthy();
      expect(queryByText("No weekly data found.")).toBeNull();
    });
  });
});
