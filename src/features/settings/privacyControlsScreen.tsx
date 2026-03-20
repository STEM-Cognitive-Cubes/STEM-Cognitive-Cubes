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

type RootStackParamList = {
  Settings: undefined;
};

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
  },
  scrollView: {
    flex: 1,
  },
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
