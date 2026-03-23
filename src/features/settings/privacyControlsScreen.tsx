import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";
import {
  savePrivacySettings,
  usePrivacySettings,
  type PrivacySettings,
} from "./settingsService";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyControlsScreen">;

type PrivacyItem = {
  key: keyof PrivacySettings;
  title: string;
  subtitle: string;
};

const privacyItems: PrivacyItem[] = [
  {
    key: "caregiverVisibility",
    title: "Caregiver Visibility",
    subtitle: "Allow connected caregivers to see shared child account information.",
  },
  {
    key: "childProgressVisibility",
    title: "Progress Visibility",
    subtitle: "Show milestone and development progress inside shared caregiver views.",
  },
  {
    key: "activityHistoryVisibility",
    title: "Activity History",
    subtitle: "Keep session history visible for review in the account experience.",
  },
  {
    key: "personalizedRecommendations",
    title: "Personalized Recommendations",
    subtitle: "Use activity patterns to tailor in-app recommendations and insights.",
  },
];

export default function PrivacyControlsScreen({ navigation }: Props) {
  const { settings, loading, error } = usePrivacySettings();
  const [localSettings, setLocalSettings] = useState<PrivacySettings>(settings);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const persist = async (key: keyof PrivacySettings, value: boolean) => {
    setSaveState("saving");

    try {
      await savePrivacySettings({ [key]: value });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  };

  const handleToggle = (key: keyof PrivacySettings, value: boolean) => {
    setLocalSettings((current) => ({
      ...current,
      [key]: value,
    }));

    persist(key, value).catch(() => undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Controls</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Manage how information is shared in the app</Text>
          <Text style={styles.heroText}>
            These settings are saved to your account so your privacy preferences stay consistent.
          </Text>
        </View>

        <Text style={styles.statusText}>
          {saveState === "saving"
            ? "Saving changes..."
            : saveState === "saved"
              ? "Changes saved"
              : saveState === "error"
                ? "Unable to save changes"
                : "Changes save automatically"}
        </Text>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color="#9333EA" />
            <Text style={styles.stateText}>Loading privacy controls...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {privacyItems.map((item) => (
              <View key={item.key} style={styles.optionCard}>
                <View style={styles.optionBody}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                </View>
                <Switch
                  value={Boolean(localSettings?.[item.key])}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
                  thumbColor={localSettings?.[item.key] ? "#9333EA" : "#F3F4F6"}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#9333EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  statusText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
  },
  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  stateText: {
    marginTop: 8,
    color: "#6B7280",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  optionBody: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
});    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  statusText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
  },
  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  stateText: {
    marginTop: 8,
    color: "#6B7280",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 20,
    padding: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  optionBody: {
    flex: 1,
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
});
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
