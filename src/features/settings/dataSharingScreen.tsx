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
  saveDataSharingSettings,
  useDataSharingSettings,
  type DataSharingSettings,
} from "./settingsService";

type Props = NativeStackScreenProps<RootStackParamList, "DataSharingScreen">;

type DataSharingItem = {
  key: keyof DataSharingSettings;
  title: string;
  subtitle: string;
};

const dataSharingItems: DataSharingItem[] = [
  {
    key: "analyticsSharing",
    title: "Usage Analytics",
    subtitle: "Share anonymized app usage to help improve core product decisions.",
  },
  {
    key: "researchParticipation",
    title: "Research Participation",
    subtitle: "Allow anonymized activity patterns to be used in future learning research.",
  },
  {
    key: "crashReports",
    title: "Crash Reports",
    subtitle: "Send technical error data so stability issues can be diagnosed faster.",
  },
  {
    key: "personalizedTips",
    title: "Personalized Tips",
    subtitle: "Use session patterns to tailor parenting tips and recommendations.",
  },
];

export default function DataSharingScreen({ navigation }: Props) {
  const { settings, loading, error } = useDataSharingSettings();
  const [localSettings, setLocalSettings] = useState<DataSharingSettings>(settings);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const persist = async (key: keyof DataSharingSettings, value: boolean) => {
    setSaveState("saving");

    try {
      await saveDataSharingSettings({ [key]: value });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1500);
    } catch {
      setSaveState("error");
    }
  };

  const handleToggle = (key: keyof DataSharingSettings, value: boolean) => {
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
        <Text style={styles.headerTitle}>Data Sharing</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Control how your data helps improve the app</Text>
          <Text style={styles.heroText}>
            These options save your consent choices to your account and can be updated any time.
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
            <Text style={styles.stateText}>Loading data sharing preferences...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {dataSharingItems.map((item) => (
              <View key={item.key} style={styles.optionCard}>
                <View style={styles.optionBody}>
                  <Text style={styles.optionTitle}>{item.title}</Text>
                  <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                </View>
                <Switch
                  value={localSettings[item.key]}
                  onValueChange={(value) => handleToggle(item.key, value)}
                  trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
                  thumbColor={localSettings[item.key] ? "#9333EA" : "#F3F4F6"}
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
});
