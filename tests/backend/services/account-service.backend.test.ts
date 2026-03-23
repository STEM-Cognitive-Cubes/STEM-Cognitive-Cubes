import { auth } from "@/services/firebase";
import {
  deleteCurrentAccount,
  ensureAccountProfile,
  saveAccountProfile,
} from "@/features/settings/account/accountService";
import {
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  readDocument,
  signInAs,
} from "../helpers/backendEmulator";

describe("accountService backend behavior", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("creates the users document when account profile initialization runs for a new user", async () => {
    const user = await createSignedInUser("backend-account-create@example.com", "Password123!");
    await ensureAccountProfile(user, {
      fullName: "Backend Parent",
      phone: "0771234567",
      dateOfBirth: "1990-01-01",
    });

    const userDoc = await readDocument(["users", user.uid]);

    expect(userDoc).toMatchObject({
      fullName: "Backend Parent",
      email: "backend-account-create@example.com",
      phone: "0771234567",
      dateOfBirth: "1990-01-01",
    });
    expect(userDoc?.createdAt).toBeDefined();
    expect(userDoc?.updatedAt).toBeDefined();
  });

  it("updates persisted account fields for the signed-in user", async () => {
    const user = await createSignedInUser("backend-account-update@example.com", "Password123!");
    await ensureAccountProfile(user, {
      fullName: "Initial Parent",
      phone: "0111111111",
      dateOfBirth: "1988-05-02",
    });

    await saveAccountProfile({
      fullName: "Updated Parent",
      email: "backend-account-update@example.com",
      phone: "0779998888",
      dateOfBirth: "1989-09-09",
    });

    const userDoc = await readDocument(["users", user.uid]);

    expect(userDoc).toMatchObject({
      fullName: "Updated Parent",
      email: "backend-account-update@example.com",
      phone: "0779998888",
      dateOfBirth: "1989-09-09",
    });
    expect(userDoc?.updatedAt).toBeDefined();
  });

  it("rejects profile updates when required backend fields are missing", async () => {
    await createSignedInUser("backend-account-invalid@example.com", "Password123!");

    await expect(
      saveAccountProfile({
        fullName: "   ",
        email: "backend-account-invalid@example.com",
        phone: "",
        dateOfBirth: "",
      })
    ).rejects.toThrow("Full name is required.");

    await expect(
      saveAccountProfile({
        fullName: "Backend Parent",
        email: "   ",
        phone: "",
        dateOfBirth: "",
      })
    ).rejects.toThrow("Email is required.");
  });

  it("deletes the firestore user document and removes the auth account", async () => {
    const email = "backend-account-delete@example.com";
    const password = "Password123!";
    const user = await createSignedInUser(email, password);
    await ensureAccountProfile(user, {
      fullName: "Delete Me",
    });

    await deleteCurrentAccount(password);

    const deletedDoc = await readDocument(["users", user.uid]);

    expect(deletedDoc).toBeUndefined();
    expect(auth.currentUser).toBeNull();
    await expect(signInAs(email, password)).rejects.toThrow();
  });
});
