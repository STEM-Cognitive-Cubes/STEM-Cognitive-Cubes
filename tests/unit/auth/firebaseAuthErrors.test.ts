import { getFirebaseAuthErrorMessage } from "@/features/auth/utils/firebaseAuthErrors";

describe("getFirebaseAuthErrorMessage", () => {
  const fallbackMessage = "Authentication failed";

  it("maps auth/invalid-email to the expected user message", () => {
    const result = getFirebaseAuthErrorMessage(
      { code: "auth/invalid-email" },
      fallbackMessage
    );

    expect(result).toBe("Invalid email address.");
  });

  it("maps credential-related login errors to the shared login failure message", () => {
    const wrongPassword = getFirebaseAuthErrorMessage(
      { code: "auth/wrong-password" },
      fallbackMessage
    );
    const invalidCredential = getFirebaseAuthErrorMessage(
      { code: "auth/invalid-credential" },
      fallbackMessage
    );

    expect(wrongPassword).toBe("Login failed. Check your email and password.");
    expect(invalidCredential).toBe(
      "Login failed. Check your email and password."
    );
  });

  it("returns fallback when the error is not firebase-shaped", () => {
    expect(
      getFirebaseAuthErrorMessage(new Error("boom"), fallbackMessage)
    ).toBe(fallbackMessage);
    expect(getFirebaseAuthErrorMessage(null, fallbackMessage)).toBe(
      fallbackMessage
    );
  });

  it("appends unknown firebase codes to the fallback message", () => {
    const result = getFirebaseAuthErrorMessage(
      { code: "auth/some-new-code" },
      fallbackMessage
    );

    expect(result).toBe("Authentication failed (auth/some-new-code)");
  });
});
