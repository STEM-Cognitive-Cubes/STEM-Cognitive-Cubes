import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { auth, db } from "../../../services/firebase";

type AccountProfileDocument = {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
  email?: string;
};

export type AccountProfile = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  initials: string;
  hasPasswordProvider: boolean;
};

type SaveAccountProfileInput = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
};

function getUserDocRef(uid: string) {
  return doc(db, "users", uid);
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim() || "User";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function buildProfile(user: User, accountDoc?: AccountProfileDocument): AccountProfile {
  const fullName =
    accountDoc?.fullName?.trim() || user.displayName?.trim() || "User";
  const email = accountDoc?.email?.trim() || user.email?.trim() || "";
  const phone = accountDoc?.phone?.trim() || user.phoneNumber?.trim() || "";
  const dateOfBirth = accountDoc?.dateOfBirth?.trim() || "";
  const hasPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  return {
    fullName,
    email,
    phone,
    dateOfBirth,
    initials: getInitials(fullName, email),
    hasPasswordProvider,
  };
}

type EnsureAccountProfileOverrides = {
  fullName?: string;
  phone?: string;
  dateOfBirth?: string;
};

export async function ensureAccountProfile(
  user: User,
  overrides?: EnsureAccountProfileOverrides
) {
  const profile = buildProfile(user);

  await setDoc(
    getUserDocRef(user.uid),
    {
      fullName: overrides?.fullName?.trim() || profile.fullName,
      email: profile.email,
      phone: overrides?.phone?.trim() || profile.phone,
      dateOfBirth: overrides?.dateOfBirth?.trim() || profile.dateOfBirth,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export function useAccountProfile() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeProfile: Unsubscribe | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      unsubscribeProfile?.();

      if (!user) {
        setProfile(null);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        await ensureAccountProfile(user);
      } catch (profileError) {
        setError(
          profileError instanceof Error
            ? profileError.message
            : "Failed to initialize your profile."
        );
      }

      unsubscribeProfile = onSnapshot(
        getUserDocRef(user.uid),
        (snapshot) => {
          setProfile(buildProfile(user, snapshot.data() as AccountProfileDocument | undefined));
          setLoading(false);
        },
        (snapshotError) => {
          setError(snapshotError.message || "Failed to load account details.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeProfile?.();
      unsubscribeAuth();
    };
  }, []);

  return { profile, loading, error };
}

export async function saveAccountProfile(input: SaveAccountProfileInput) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to update your profile.");
  }

  const trimmedFullName = input.fullName.trim();
  const trimmedEmail = input.email.trim();
  const trimmedPhone = input.phone.trim();
  const trimmedDateOfBirth = input.dateOfBirth.trim();

  if (!trimmedFullName) {
    throw new Error("Full name is required.");
  }

  if (!trimmedEmail) {
    throw new Error("Email is required.");
  }

  if (trimmedFullName !== (user.displayName ?? "")) {
    await updateProfile(user, { displayName: trimmedFullName });
  }

  if (trimmedEmail !== (user.email ?? "")) {
    try {
      await updateEmail(user, trimmedEmail);
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String(error.code)
          : "";

      if (code === "auth/requires-recent-login") {
        throw new Error("Please log in again before changing your email address.");
      }

      throw error;
    }
  }

  await setDoc(
    getUserDocRef(user.uid),
    {
      fullName: trimmedFullName,
      email: trimmedEmail,
      phone: trimmedPhone,
      dateOfBirth: trimmedDateOfBirth,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function changeAccountPassword(
  currentPassword: string,
  newPassword: string
) {
  const user = auth.currentUser;

  if (!user || !user.email) {
    throw new Error("You need to be logged in to change your password.");
  }

  const hasPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  if (!hasPasswordProvider) {
    throw new Error(
      "This account does not use an email/password login, so password changes are not available here."
    );
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

export async function deleteCurrentAccount(currentPassword?: string) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("You need to be logged in to delete your account.");
  }

  const hasPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  if (hasPasswordProvider) {
    if (!user.email || !currentPassword) {
      throw new Error("Please enter your current password to delete this account.");
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  }

  await deleteDoc(getUserDocRef(user.uid)).catch(() => undefined);
  await deleteUser(user);
}

export async function logoutCurrentUser() {
  await signOut(auth);

  try {
    await GoogleSignin.signOut();
  } catch {
    // Ignore Google sign-out errors if the current session is not Google-backed.
  }
}
