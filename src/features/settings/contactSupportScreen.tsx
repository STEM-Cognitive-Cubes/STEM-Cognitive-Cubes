import React from "react";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SettingsPlaceholderScreen from "./common/SettingsPlaceholderScreen";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "ContactSupportScreen">;

export default function ContactSupportScreen({ navigation }: Props) {
  return (
    <SettingsPlaceholderScreen
      navigation={navigation}
      title="Contact Support"
      description="This screen can be extended with direct support options for urgent issues."
      highlights={[
        "List email, chat, and escalation contact paths.",
        "Explain expected support response times.",
        "Provide a stable route for future contact tooling.",
      ]}
    />
  );
}
