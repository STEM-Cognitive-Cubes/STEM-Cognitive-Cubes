import {
  ensureNotificationSettings,
  saveNotificationSettings,
  savePrivacySettings,
} from "@/features/settings/settingsService";
import {
  cleanupBackendTestEnv,
  clearBackendState,
  createSignedInUser,
  readDocument,
  signOutCurrentUser,
} from "../helpers/backendEmulator";

describe("settingsService backend behavior", () => {
  beforeEach(async () => {
    await clearBackendState();
  });

  afterAll(async () => {
    await cleanupBackendTestEnv();
  });

  it("creates notification settings with the expected default backend shape", async () => {
    const user = await createSignedInUser("backend-settings-defaults@example.com", "Password123!");
    await ensureNotificationSettings(user.uid);

    const userDoc = await readDocument(["users", user.uid]);

    expect(userDoc?.settings).toMatchObject({
      notifications: {
        enableAll: false,
        batteryAlerts: true,
        connectionStatus: false,
        milestoneMoments: true,
        parentingTips: false,
      },
    });
    expect(userDoc?.updatedAt).toBeDefined();
  });

  it("persists a partial notification update without dropping the remaining notification fields", async () => {
    const user = await createSignedInUser("backend-settings-merge@example.com", "Password123!");
    await ensureNotificationSettings(user.uid);

    await saveNotificationSettings({
      batteryAlerts: false,
    });

    const userDoc = await readDocument(["users", user.uid]);
    const notifications = userDoc?.settings as
      | { notifications?: Record<string, unknown> }
      | undefined;

    expect(notifications?.notifications).toMatchObject({
      enableAll: false,
      batteryAlerts: false,
      connectionStatus: false,
      milestoneMoments: true,
      parentingTips: false,
    });
  });

  it("rejects settings writes when no authenticated backend user exists", async () => {
    await createSignedInUser("backend-settings-auth@example.com", "Password123!");
    await signOutCurrentUser();

    await expect(
      savePrivacySettings({
        caregiverVisibility: false,
      })
    ).rejects.toThrow("You need to be logged in to update privacy settings.");
  });
});
