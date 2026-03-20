import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "./common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "DataSharingScreen">;

export default function DataSharingScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Data Sharing"
      description="Configure how anonymized usage and development data can be shared."
      highlights={[
        "Explain what data can be shared and why.",
        "Provide clear consent controls for analytics and research.",
        "Keep these preferences available from the main settings menu.",
      ]}
    />
  );
}
