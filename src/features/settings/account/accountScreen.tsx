import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "../common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "Account">;

export default function AccountScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Account"
      description="Manage the parent profile connected to the STEM Cognitive Cubes app."
      highlights={[
        "Review account details and linked sign-in methods.",
        "Jump to profile edits and password changes.",
        "Keep core account actions in one place.",
      ]}
    />
  );
}
