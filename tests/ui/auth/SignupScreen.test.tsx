import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import SignupScreen from "@/features/auth/screens/SignupScreen";

jest.mock("@expo/vector-icons", () => ({
  Feather: () => {
    const { Text } = require("react-native");
    return <Text>FeatherIcon</Text>;
  },
}));
jest.mock("@/features/auth/components/AuthBackground", () => () => null);
jest.mock("@/features/auth/components/AuthSuccessModal", () => () => null);
jest.mock("@/features/settings/account/accountService", () => ({
  ensureAccountProfile: jest.fn(),
}));
jest.mock("@/services/firebase", () => ({
  auth: {},
  db: {},
}));
jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    signOut: jest.fn(),
  },
}));
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  fetchSignInMethodsForEmail: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

describe("SignupScreen", () => {
  const navigation = {
    navigate: jest.fn(),
  };

  it("renders the main signup screen content", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignupScreen navigation={navigation as never} />,
    );

    expect(getByText("Create Account")).toBeTruthy();
    expect(getByText("Start your smart building journey.")).toBeTruthy();
    expect(getByText("PARENT DETAILS")).toBeTruthy();
    expect(getByPlaceholderText("First Name")).toBeTruthy();
    expect(getByPlaceholderText("Last Name")).toBeTruthy();
    expect(getByPlaceholderText("Email Address")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm password")).toBeTruthy();
    expect(getByText("Sign up")).toBeTruthy();
    expect(getByText("Log out")).toBeTruthy();
  });
});
