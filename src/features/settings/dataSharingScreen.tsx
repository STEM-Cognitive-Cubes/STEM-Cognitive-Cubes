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
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DataSharingScreenProps {
  navigation: NavigationProp;
}

type DataSharingSettings = {
  usageAnalytics: boolean;
  crashReports: boolean;
  researchPartners: boolean;
  educatorAccess: boolean;
};

const DataSharingScreen: React.FC<DataSharingScreenProps> = ({ navigation }) => {
  const [settings, setSettings] = useState<DataSharingSettings>({
    usageAnalytics: true,
    crashReports: true,
    researchPartners: false,
    educatorAccess: false,
  });

  const updateSetting = <K extends keyof DataSharingSettings>(
    key: K,
    value: DataSharingSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Download My Data',
      'Your data export will be prepared and sent to your email address within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: () => console.log('Data download requested'),
        },
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Data Sharing</Text>
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
        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="information-circle" size={24} color="#9333EA" />
          <Text style={styles.privacyNoticeText}>
            We value your privacy. Most child's personal info is encrypted and never sold. You control exactly who sees what.
          </Text>
        </View>

        {/* App Improvement Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP IMPROVEMENT</Text>

          <View style={[styles.dataItem]}>
            <View style={styles.dataLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <MaterialIcons name="analytics" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.dataTextContainer}>
                <Text style={styles.dataTitle}>Usage Analytics</Text>
                <Text style={styles.dataSubtitle}>Help us improve app features</Text>
              </View>
            </View>
            <Switch
              value={settings.usageAnalytics}
              onValueChange={(value) => updateSetting('usageAnalytics', value)}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={settings.usageAnalytics ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={[styles.dataItem]}>
            <View style={styles.dataLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <MaterialIcons name="bug-report" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.dataTextContainer}>
                <Text style={styles.dataTitle}>Crash Reports</Text>
                <Text style={styles.dataSubtitle}>Send anonymous data to fix bugs</Text>
              </View>
            </View>
            <Switch
              value={settings.crashReports}
              onValueChange={(value) => updateSetting('crashReports', value)}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={settings.crashReports ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          <View style={[styles.dataItem]}>
            <View style={styles.dataLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <MaterialIcons name="science" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.dataTextContainer}>
                <Text style={styles.dataTitle}>Research Partners</Text>
                <Text style={styles.dataSubtitle}>Share anonymized data for child development studies</Text>
              </View>
            </View>
            <Switch
              value={settings.researchPartners}
              onValueChange={(value) => updateSetting('researchPartners', value)}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={settings.researchPartners ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Sharing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHARING</Text>

          <View style={[styles.dataItem]}>
            <View style={styles.dataLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#9333EA' }]}>
                <Ionicons name="school" size={20} color="#FFFFFF" />
              </View>
              <View style={styles.dataTextContainer}>
                <Text style={styles.dataTitle}>Educator Access</Text>
                <Text style={styles.dataSubtitle}>Let teachers view progress</Text>
              </View>
            </View>
            <Switch
              value={settings.educatorAccess}
              onValueChange={(value) => updateSetting('educatorAccess', value)}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={settings.educatorAccess ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* Download Data Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadData}
            activeOpacity={0.7}
          >
            <Ionicons name="download" size={20} color="#FFFFFF" />
            <Text style={styles.downloadButtonText}>Download My Data</Text>
          </TouchableOpacity>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EDE9FE',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 12,
  },
  privacyNoticeText: {
    flex: 1,
    fontSize: 14,
    color: '#5B21B6',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  dataItem: {
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
  dataLeft: {
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
  dataTextContainer: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  dataSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
  },
   downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default DataSharingScreen;
