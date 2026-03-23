import { fireEvent, render, waitFor } from "@testing-library/react-native";

import { auth } from "@/services/firebase";
import LoginScreen from "@/features/auth/screens/LoginScreen";
import SignupScreen from "@/features/auth/screens/SignupScreen";

import {
  cleanupIntegrationTestEnv,
  clearIntegrationState,
  createSignedInUser,
  readDocument,
  seedUserDoc,
  signOutCurrentUser,
} from "../helpers/firebaseEmulator";

jest.mock("@react-native-google-signin/google-signin", () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(),
    signOut: jest.fn(),
    signIn: jest.fn(),
    getTokens: jest.fn(),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: "SIGN_IN_CANCELLED",
    IN_PROGRESS: "IN_PROGRESS",
    PLAY_SERVICES_NOT_AVAILABLE: "PLAY_SERVICES_NOT_AVAILABLE",
  },
}));

describe("auth integration flows", () => {
  const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);

  beforeEach(async () => {
    await clearIntegrationState();
  });

  afterAll(async () => {
    consoleWarnSpy.mockRestore();
    consoleLogSpy.mockRestore();
    await cleanupIntegrationTestEnv();
  });

  it("surfaces a signup integration failure when parent profile writes are blocked by current Firestore rules", async () => {
    const navigation = {
      navigate: jest.fn(),
    };
    const email = `signup-${Date.now()}@blokc.test`;

    const screen = render(<SignupScreen navigation={navigation as never} />);

    fireEvent.changeText(screen.getByPlaceholderText("First Name"), "Alice");
    fireEvent.changeText(screen.getByPlaceholderText("Last Name"), "Builder");
    fireEvent.changeText(screen.getByPlaceholderText("Email Address"), email);
    fireEvent.changeText(screen.getByPlaceholderText("Password"), "TestPass123!");
    fireEvent.changeText(
      screen.getByPlaceholderText("Confirm password"),
      "TestPass123!"
    );

    fireEvent.press(screen.getByText("Sign up"));

    expect(await screen.findByText(/Sign up failed\. Try again\./)).toBeTruthy();

    const signedInUser = auth.currentUser;
    expect(signedInUser?.email).toBe(email);

    const userDoc = await readDocument(["users", signedInUser!.uid]);
    const parentDoc = await readDocument(["parents", signedInUser!.uid]);

    expect(userDoc).toMatchObject({
      fullName: "Alice Builder",
      email,
    });
    expect(parentDoc).toBeUndefined();
  });

  it("shows a login failure even with valid credentials because the current flow still depends on parents collection access", async () => {
    const email = `login-${Date.now()}@blokc.test`;
    const password = "LoginPass123!";
    const user = await createSignedInUser(email, password);

    await seedUserDoc(user.uid, {
      fullName: "Existing Parent",
      email,
      updatedAt: new Date().toISOString(),
    });

    await signOutCurrentUser();

    const navigation = {
      replace: jest.fn(),
      navigate: jest.fn(),
    };

    const screen = render(<LoginScreen navigation={navigation as never} />);

    fireEvent.changeText(screen.getByPlaceholderText("Enter your email"), email);
    fireEvent.changeText(screen.getByPlaceholderText("Enter your password"), password);
    fireEvent.press(screen.getByText("Login"));

    expect(
      await screen.findByText(/Login failed\. Check your email and password\./)
    ).toBeTruthy();

    await waitFor(() => {
      expect(auth.currentUser?.uid).toBe(user.uid);
    });

    const parentDoc = await readDocument(["parents", user.uid]);
    expect(parentDoc).toBeUndefined();
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
