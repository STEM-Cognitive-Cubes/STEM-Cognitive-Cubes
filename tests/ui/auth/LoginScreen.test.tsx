import React from "react";
import { render } from "@testing-library/react-native";

import LoginScreen from "@/features/auth/screens/LoginScreen";

jest.mock("@expo/vector-icons", () => ({
  Feather: () => {
    const { Text } = require("react-native");
    return <Text>FeatherIcon</Text>;
  },
  FontAwesome: () => {
    const { Text } = require("react-native");
    return <Text>FontAwesomeIcon</Text>;
  },
}));
jest.mock("@/features/auth/components/AuthBackground", () => () => null);
jest.mock("@/features/auth/components/ForgotPasswordModal", () => () => null);
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
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getTokens: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
    IN_PROGRESS: "IN_PROGRESS",
    PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  },
}));
jest.mock("firebase/auth", () => ({
  GoogleAuthProvider: { credential: jest.fn() },
  fetchSignInMethodsForEmail: jest.fn(),
  signInWithCredential: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

describe("LoginScreen", () => {
  const navigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
    replace: jest.fn(),
  };

  it("renders the main login screen content", () => {
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen navigation={navigation as never} />,
    );

    expect(getByText(/Hi, Welcome to/)).toBeTruthy();
    expect(getByText(/BlokC/)).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByText("Forgot password?")).toBeTruthy();
    expect(getByText("Login")).toBeTruthy();
    expect(getByText("Login with Google")).toBeTruthy();
    expect(getByText("Create an account")).toBeTruthy();
  });
});
