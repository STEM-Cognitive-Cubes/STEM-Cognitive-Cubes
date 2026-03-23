import React from "react";
import { Text } from "react-native";
import { fireEvent, render } from "@testing-library/react-native";

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

  beforeEach(() => {
    navigation.navigate.mockClear();
  });

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

  it("updates the signup form inputs", () => {
    const { getByPlaceholderText } = render(
      <SignupScreen navigation={navigation as never} />,
    );

    const firstNameInput = getByPlaceholderText("First Name");
    const lastNameInput = getByPlaceholderText("Last Name");
    const emailInput = getByPlaceholderText("Email Address");
    const passwordInput = getByPlaceholderText("Password");
    const confirmPasswordInput = getByPlaceholderText("Confirm password");

    fireEvent.changeText(firstNameInput, "Sam");
    fireEvent.changeText(lastNameInput, "Perera");
    fireEvent.changeText(emailInput, "sam@example.com");
    fireEvent.changeText(passwordInput, "secret123");
    fireEvent.changeText(confirmPasswordInput, "secret123");

    expect(firstNameInput.props.value).toBe("Sam");
    expect(lastNameInput.props.value).toBe("Perera");
    expect(emailInput.props.value).toBe("sam@example.com");
    expect(passwordInput.props.value).toBe("secret123");
    expect(confirmPasswordInput.props.value).toBe("secret123");
  });

  it("shows an error when email or password is missing", () => {
    const { getByText } = render(<SignupScreen navigation={navigation as never} />);

    fireEvent.press(getByText("Sign up"));

    expect(getByText("Please enter email and password.")).toBeTruthy();
  });
});
