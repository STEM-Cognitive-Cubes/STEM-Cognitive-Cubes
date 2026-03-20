import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "./common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyControlsScreen">;

export default function PrivacyControlsScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Privacy Controls"
      description="Choose how activity and child-development information is handled in the app."
      highlights={[
        "Review privacy-related preferences in one place.",
        "Decide how much shared data is visible to caregivers.",
        "Reserve space for future privacy toggles and consent controls.",
      ]}
    />
  );
}
