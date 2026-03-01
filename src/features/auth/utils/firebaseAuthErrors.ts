import type { FirebaseError } from "firebase/app";

const isFirebaseError = (error: unknown): error is FirebaseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as FirebaseError).code === "string"
  );
};

export const getFirebaseAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (!isFirebaseError(error)) {
    return fallbackMessage;
  }

  switch (error.code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-disabled":
      return "This user account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Login failed. Check your email and password.";
    case "auth/email-already-in-use":
      return "That email is already in use. Try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled in Firebase console.";
    case "auth/network-request-failed":
      return "Network error. Check your internet connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later or reset your password.";
    default:
      return `${fallbackMessage} (${error.code})`;
  }
};

