import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';
import {
  saveNotificationSettings,
  useNotificationSettings,
  type NotificationSettings,
} from './settingsService';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'NotificationPreferencesScreen'
>;

interface NotificationPreferencesScreenProps {
  navigation: NavigationProp;
}

const NotificationPreferencesScreen: React.FC<
  NotificationPreferencesScreenProps
> = ({ navigation }) => {
  const { settings, loading, error } = useNotificationSettings();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle'
  );

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const persist = async (nextSettings: Partial<NotificationSettings>) => {
    setSaveState('saving');

    try {
      await saveNotificationSettings(nextSettings);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 1500);
    } catch {
      setSaveState('error');
    }
  };

  const handleEnableAll = (value: boolean) => {
    const nextState: NotificationSettings = {
      enableAll: value,
      batteryAlerts: value,
      connectionStatus: value,
      milestoneMoments: value,
      parentingTips: value,
    };

    setLocalSettings(nextState);
    persist(nextState).catch(() => undefined);
  };

  const handleToggle = (
    key: Exclude<keyof NotificationSettings, 'enableAll'>,
    value: boolean
  ) => {
    const nextState = {
      ...localSettings,
      [key]: value,
    };

    nextState.enableAll =
      nextState.batteryAlerts &&
      nextState.connectionStatus &&
      nextState.milestoneMoments &&
      nextState.parentingTips;

    setLocalSettings(nextState);
    persist(nextState).catch(() => undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.statusText}>
          {saveState === 'saving'
            ? 'Saving changes...'
            : saveState === 'saved'
              ? 'Changes saved'
              : saveState === 'error'
                ? 'Unable to save changes'
                : 'Changes save automatically'}
        </Text>

        {loading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator size="small" color="#9333EA" />
            <Text style={styles.stateText}>Loading notification preferences...</Text>
          </View>
        ) : (
          <>
            {error ? (
              <View style={styles.errorCard}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                <View style={styles.primaryIconContainer}>
                  <Ionicons name="notifications" size={20} color="#FFFFFF" />
                </View>

                <View style={styles.notificationTextContainer}>
                  <Text style={styles.notificationTitle}>Enable All</Text>
                  <Text style={styles.notificationSubtitle}>
                    Turn all notifications on or off
                  </Text>
                </View>
              </View>

              <Switch
                value={localSettings.enableAll}
                onValueChange={handleEnableAll}
                trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                thumbColor={localSettings.enableAll ? '#9333EA' : '#F3F4F6'}
                ios_backgroundColor="#D1D5DB"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>HARDWARE & SYSTEM</Text>

              <View style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                  <View style={styles.primaryIconContainer}>
                    <Ionicons name="battery-charging" size={20} color="#FFFFFF" />
                  </View>

                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Battery Alerts</Text>
                    <Text style={styles.notificationSubtitle}>
                      Notify when cubes need charging
                    </Text>
                  </View>
                </View>

                <Switch
                  value={localSettings.batteryAlerts}
                  onValueChange={(value) => handleToggle('batteryAlerts', value)}
                  trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                  thumbColor={localSettings.batteryAlerts ? '#9333EA' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>

              <View style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                  <View style={styles.primaryIconContainer}>
                    <MaterialIcons name="wifi" size={20} color="#FFFFFF" />
                  </View>

                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Connection Status</Text>
                    <Text style={styles.notificationSubtitle}>
                      Alert if any cubes disconnect during play
                    </Text>
                  </View>
                </View>

                <Switch
                  value={localSettings.connectionStatus}
                  onValueChange={(value) => handleToggle('connectionStatus', value)}
                  trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                  thumbColor={localSettings.connectionStatus ? '#9333EA' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CHILD DEVELOPMENT</Text>

              <View style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                  <View style={styles.primaryIconContainer}>
                    <MaterialIcons name="emoji-events" size={20} color="#FFFFFF" />
                  </View>

                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Milestone Moments</Text>
                    <Text style={styles.notificationSubtitle}>
                      Celebrate when new skills are unlocked
                    </Text>
                  </View>
                </View>

                <Switch
                  value={localSettings.milestoneMoments}
                  onValueChange={(value) => handleToggle('milestoneMoments', value)}
                  trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                  thumbColor={localSettings.milestoneMoments ? '#9333EA' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>

              <View style={styles.notificationItem}>
              <View style={styles.notificationLeft}>
                  <View style={styles.primaryIconContainer}>
                    <Ionicons name="book" size={20} color="#FFFFFF" />
                  </View>

                  <View style={styles.notificationTextContainer}>
                    <Text style={styles.notificationTitle}>Parenting Tips</Text>
                    <Text style={styles.notificationSubtitle}>
                      Weekly advice based on play patterns
                    </Text>
                  </View>
                </View>

                <Switch
                  value={localSettings.parentingTips}
                  onValueChange={(value) => handleToggle('parentingTips', value)}
                  trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
                  thumbColor={localSettings.parentingTips ? '#9333EA' : '#F3F4F6'}
                  ios_backgroundColor="#D1D5DB"
                />
              </View>
            </View>
          </>
        )}
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
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
    marginBottom: 12,
  },
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  stateText: {
    marginTop: 8,
    color: '#6B7280',
  },
  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
  },
  notificationLeft: {
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
  primaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#9333EA',
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default NotificationPreferencesScreen;
