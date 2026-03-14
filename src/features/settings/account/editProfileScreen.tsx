import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "../common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "EditProfile">;

export default function EditProfileScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Edit Profile"
      description="Update the parent details shown across the app."
      highlights={[
        "Change display name and contact information.",
        "Keep caregiver details current for support requests.",
        "Prepare the screen for a future profile form.",
      ]}
    />
  );
}
