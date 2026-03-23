import React from "react";
import { View } from "react-native";
import { render } from "@testing-library/react-native";

import ProfileScreen from "@/features/profile/profile";

const mockNavigate = jest.fn();
const mockOnSnapshot = jest.fn();
const mockParentDocRef = { kind: "parent-doc" };
const mockChildrenQuery = { kind: "children-query" };

jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));
jest.mock("@expo/vector-icons", () => ({
  Ionicons: () => {
    const { Text } = require("react-native");
    return <Text>Icon</Text>;
  },
}));
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(() => mockParentDocRef),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  orderBy: jest.fn(),
  query: jest.fn(() => mockChildrenQuery),
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

describe("ProfileScreen", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOnSnapshot.mockReset();
    mockOnSnapshot.mockImplementation((target: unknown, onNext: (value: unknown) => void) => {
      if (target === mockParentDocRef) {
        onNext({
          exists: () => true,
          data: () => ({
            firstName: "Sam",
            lastName: "Perera",
            email: "sam@example.com",
          }),
        });
      } else if (target === mockChildrenQuery) {
        onNext({
          forEach: () => {},
        });
      }
      return jest.fn();
    });
  });

  it("renders the main profile screen sections", () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText("Profile")).toBeTruthy();
    expect(getByText("Sam Perera")).toBeTruthy();
    expect(getByText("sam@example.com")).toBeTruthy();
    expect(getByText("Child Profile")).toBeTruthy();
    expect(getByText("Add Another Child")).toBeTruthy();
    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Notifications")).toBeTruthy();
    expect(getByText("Daily insights & updates")).toBeTruthy();
  });
});
