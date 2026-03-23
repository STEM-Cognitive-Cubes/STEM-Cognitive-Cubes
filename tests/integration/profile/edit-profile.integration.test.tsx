import { Alert } from "react-native";

import { fireEvent, render, waitFor } from "@testing-library/react-native";

import EditProfileScreen from "@/features/settings/account/editProfileScreen";

import {
  cleanupIntegrationTestEnv,
  clearIntegrationState,
  createSignedInUser,
  readDocument,
} from "../helpers/firebaseEmulator";

describe("edit profile integration", () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);

  beforeEach(async () => {
    await clearIntegrationState();
  });

  afterAll(async () => {
    alertSpy.mockRestore();
    await cleanupIntegrationTestEnv();
  });

  it("loads and persists account profile updates to the users collection", async () => {
    const email = `profile-${Date.now()}@blokc.test`;
    const user = await createSignedInUser(email, "ProfilePass123!");

    const navigation = {
      goBack: jest.fn(),
    };
    const route = {
      key: "EditProfile-test",
      name: "EditProfile",
    };

    const screen = render(
      <EditProfileScreen navigation={navigation as never} route={route as never} />
    );

    expect(await screen.findByDisplayValue(email)).toBeTruthy();

    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your full name"),
      "Taylor Parent Updated"
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Enter your phone number"),
      "0710000000"
    );
    fireEvent.changeText(screen.getByPlaceholderText("DD/MM/YYYY"), "02/02/1992");

    fireEvent.press(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Success",
        "Profile updated successfully.",
        expect.any(Array)
      );
    });

    const userDoc = await readDocument(["users", user.uid]);

    expect(userDoc).toMatchObject({
      fullName: "Taylor Parent Updated",
      email,
      phone: "0710000000",
      dateOfBirth: "02/02/1992",
    });
  });
});
