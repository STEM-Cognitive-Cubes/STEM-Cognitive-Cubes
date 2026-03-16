import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "../common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "DeleteAccount">;

export default function DeleteAccountScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Delete Account"
      description="This reserved screen can hold the account deletion confirmation flow."
      highlights={[
        "Explain what data is removed before confirming.",
        "Require a final confirmation step for safety.",
        "Keep destructive account actions isolated from normal settings.",
      ]}
    />
  );
}
