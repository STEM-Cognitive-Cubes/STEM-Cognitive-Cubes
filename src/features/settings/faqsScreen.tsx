import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "./common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "FAQsScreen">;

export default function FAQsScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="FAQs"
      description="A dedicated place for common setup, session, and troubleshooting answers."
      highlights={[
        "Document common parent questions about sessions and tracking.",
        "Add quick answers before users need live support.",
        "Keep product guidance accessible from the support section.",
      ]}
    />
  );
}
