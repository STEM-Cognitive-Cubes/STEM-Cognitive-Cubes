import { fireEvent, render, waitFor } from "@testing-library/react-native";

import NotificationPreferencesScreen from "@/features/settings/notificationScreen";

import {
  cleanupIntegrationTestEnv,
  clearIntegrationState,
  createSignedInUser,
  readDocument,
  seedUserDoc,
} from "../helpers/firebaseEmulator";

describe("notification settings integration", () => {
  beforeEach(async () => {
    await clearIntegrationState();
  });

  afterAll(async () => {
    await cleanupIntegrationTestEnv();
  });

  it("currently reapplies default notification values on remount after a successful save", async () => {
    const email = `notifications-${Date.now()}@blokc.test`;
    const user = await createSignedInUser(email, "SettingsPass123!");

    await seedUserDoc(user.uid, {
      settings: {
        notifications: {
          enableAll: false,
          batteryAlerts: true,
          connectionStatus: false,
          milestoneMoments: true,
          parentingTips: false,
        },
      },
      updatedAt: new Date().toISOString(),
    });

    const navigation = {
      goBack: jest.fn(),
    };
    const screen = render(
      <NotificationPreferencesScreen navigation={navigation as never} />
    );

    await waitFor(() => {
      expect(
        screen.queryByText("Loading notification preferences...")
      ).toBeNull();
    });

    expect(screen.getByTestId("notification-battery-alerts-switch").props.value).toBe(true);

    fireEvent(
      screen.getByTestId("notification-battery-alerts-switch"),
      "valueChange",
      false
    );

    await waitFor(async () => {
      const userDoc = await readDocument(["users", user.uid]);
      expect(userDoc).toMatchObject({
        settings: {
          notifications: {
            batteryAlerts: false,
          },
        },
      });
    });

    screen.unmount();

    const rerenderedScreen = render(
      <NotificationPreferencesScreen navigation={navigation as never} />
    );

    await waitFor(() => {
      expect(
        rerenderedScreen.queryByText("Loading notification preferences...")
      ).toBeNull();
    });

    expect(
      rerenderedScreen.getByTestId("notification-battery-alerts-switch").props.value
    ).toBe(true);

    const reloadedUserDoc = await readDocument(["users", user.uid]);
    expect(reloadedUserDoc).toMatchObject({
      settings: {
        notifications: {
          batteryAlerts: true,
        },
      },
    });
  });
});
