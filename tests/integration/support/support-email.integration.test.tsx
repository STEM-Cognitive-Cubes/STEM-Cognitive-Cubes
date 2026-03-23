import { Alert } from "react-native";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import EmailScreen from "@/features/settings/helpAndSupport/emailSupport";

import {
  cleanupIntegrationTestEnv,
  clearIntegrationState,
  createSignedInUser,
  readCollection,
} from "../helpers/firebaseEmulator";

describe("support email integration", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

  beforeEach(async () => {
    await clearIntegrationState();
  });

  afterAll(async () => {
    alertSpy.mockRestore();
    await cleanupIntegrationTestEnv();
  });

  it("saves a support ticket for the signed-in user from the email support screen", async () => {
    const email = `support-email-${Date.now()}@blokc.test`;
    const user = await createSignedInUser(email, "SupportPass123!");
    const navigation = {
      goBack: jest.fn(),
    };
    const route = {
      key: "EmailScreen-test",
      name: "EmailScreen",
    };

    const screen = render(
      <EmailScreen navigation={navigation as never} route={route as never} />
    );

    fireEvent.changeText(
      screen.getByPlaceholderText("Briefly describe the issue"),
      "Battery alert did not appear"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Explain what happened and what you expected."),
      "The cube battery dropped below 10 percent but no notification was shown."
    );

    fireEvent.press(screen.getByText("Send"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Support request sent",
        "Your message has been saved for the support team.",
        expect.any(Array)
      );
    });

    const tickets = await readCollection(["users", user.uid, "supportTickets"]);

    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toMatchObject({
      channel: "email",
      subject: "Battery alert did not appear",
      message:
        "The cube battery dropped below 10 percent but no notification was shown.",
      status: "open",
    });
  });
});
