import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "../common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ChangePassword">;

export default function ChangePasswordScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Change Password"
      description="Use this screen to rotate the account password safely."
      highlights={[
        "Verify the current password before saving changes.",
        "Confirm the new password to avoid mistakes.",
        "Keep authentication actions inside the settings flow.",
      ]}
    />
  );
}
