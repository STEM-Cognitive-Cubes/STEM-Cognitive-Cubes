<<<<<<< HEAD
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
=======
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
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)

type RootStackParamList = {
  Settings: undefined;
};

<<<<<<< HEAD
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface PrivacyControlsScreenProps {
  navigation: NavigationProp;
}

const PrivacyControlsScreen: React.FC<PrivacyControlsScreenProps> = ({ navigation }) => {
  const [showActivityHistory, setShowActivityHistory] = useState(false);
  const [hideSensitiveInfo, setHideSensitiveInfo] = useState(true);
  const [disableInteractionHistory, setDisableInteractionHistory] = useState(false);
  const [sensitiveAlertsMode, setSensitiveAlertsMode] = useState(false);
  const [selectedRetention, setSelectedRetention] = useState<'7' | '30' | '90'>('7');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Control</Text>
        <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
          <Ionicons name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Activity Tracking Section */}
        <View style={styles.section}>
          <View style={[styles.privacyItem]}>
            <View style={styles.privacyLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="eye" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Show Activity History</Text>
              </View>
            </View>
            <Switch
              value={showActivityHistory}
              onValueChange={setShowActivityHistory}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={showActivityHistory ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={[styles.privacyItem]}>
            <View style={styles.privacyLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Hide Sensitive Infomation</Text>
              </View>
            </View>
            <Switch
              value={hideSensitiveInfo}
              onValueChange={setHideSensitiveInfo}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={hideSensitiveInfo ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={[styles.privacyItem]}>
            <View style={styles.privacyLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="close-circle" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Disable Interaction History Storage</Text>
              </View>
            </View>
            <Switch
              value={disableInteractionHistory}
              onValueChange={setDisableInteractionHistory}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={disableInteractionHistory ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={[styles.privacyItem]}>
            <View style={styles.privacyLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.privacyTextContainer}>
                <Text style={styles.privacyTitle}>Sensitive Alerts Mode</Text>
              </View>
            </View>
            <Switch
              value={sensitiveAlertsMode}
              onValueChange={setSensitiveAlertsMode}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={sensitiveAlertsMode ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Data Retention Period Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention Period</Text>

          <View style={styles.retentionOptions}>
            <TouchableOpacity
              style={[
                styles.retentionOption,
                selectedRetention === '7' && styles.retentionOptionSelected,
              ]}
              onPress={() => setSelectedRetention('7')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.retentionText,
                selectedRetention === '7' && styles.retentionTextSelected,
              ]}>
                7 days
              </Text>
              <Switch
                value={selectedRetention === '7'}
                onValueChange={() => setSelectedRetention('7')}
                trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                thumbColor={selectedRetention === '7' ? '#9333EA' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.retentionOption,
                selectedRetention === '30' && styles.retentionOptionSelected,
              ]}
              onPress={() => setSelectedRetention('30')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.retentionText,
                selectedRetention === '30' && styles.retentionTextSelected,
              ]}>
                30 days
              </Text>
              <Switch
                value={selectedRetention === '30'}
                onValueChange={() => setSelectedRetention('30')}
                trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                thumbColor={selectedRetention === '30' ? '#9333EA' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.retentionOption,
                selectedRetention === '90' && styles.retentionOptionSelected,
              ]}
              onPress={() => setSelectedRetention('90')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.retentionText,
                selectedRetention === '90' && styles.retentionTextSelected,
              ]}>
                90 days
              </Text>
              <Switch
                value={selectedRetention === '90'}
                onValueChange={() => setSelectedRetention('90')}
                trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                thumbColor={selectedRetention === '90' ? '#9333EA' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    backgroundColor: '#9333EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
=======
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
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)
  },
  scrollView: {
    flex: 1,
  },
<<<<<<< HEAD
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    marginLeft: 4,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyTextContainer: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  retentionOptions: {
    gap: 12,
  },
  retentionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  retentionOptionSelected: {
    borderColor: '#FDE047',
    backgroundColor: '#FFFBEB',
  },
  retentionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  retentionTextSelected: {
    color: '#9333EA',
  },
});

export default PrivacyControlsScreen;
=======
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
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)
