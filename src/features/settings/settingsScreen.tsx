import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logoutCurrentUser } from './account/accountService';
import { signOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../../services/firebase';

type RootStackParamList = {
  Settings: undefined;
  Account: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  AppearanceScreen: undefined;
  NotificationPreferencesScreen: undefined;
  PrivacyControlsScreen: undefined;
  DataSharingScreen: undefined;
  HelpSupportScreen: undefined;
  UserGuideScreen: undefined;
  ProductIntro: undefined;
  AppFeatures: undefined;
  OperateScreen: undefined;
  CommunityScreen: undefined;
  EmailScreen: undefined;
  ChatScreen: undefined;
  Logout: undefined;
  FAQsScreen: undefined;
  ContactSupportScreen: undefined;
  Home: undefined;
  Login: undefined;
  History: undefined;
  Insights: undefined;
  Profile: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingsScreenProps {
  navigation?: NavigationProp;
}

interface SettingOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialIcons';
  screen: keyof RootStackParamList;
  group: 'main' | 'preferences' | 'support';
  color: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [scaleValues] = useState(
    Array(9).fill(0).map(() => new Animated.Value(1))
  );

  const settingsOptions: SettingOption[] = [
    {
      id: '1',
      title: 'Account',
      subtitle: 'Manage your account details',
      icon: 'person',
      iconType: 'Ionicons',
      screen: 'Account',
      group: 'main',
      color: '#FF5B33',
    },
    {
      id: '2',
      title: 'Appearance',
      subtitle: 'Customize your experience',
      icon: 'palette',
      iconType: 'MaterialIcons',
      screen: 'AppearanceScreen',
      group: 'main',
      color: '#67C30F',
    },
    {
      id: '3',
      title: 'Notification Preferences',
      subtitle: 'Control your notifications',
      icon: 'notifications-active',
      iconType: 'MaterialIcons',
      screen: 'NotificationPreferencesScreen',
      group: 'preferences',
      color: '#7C3AED',
    },
    {
      id: '4',
      title: 'Privacy Controls',
      subtitle: 'Manage your privacy',
      icon: 'shield-checkmark',
      iconType: 'Ionicons',
      screen: 'PrivacyControlsScreen',
      group: 'preferences',
      color: '#6366F1',
    },
    {
      id: '5',
      title: 'Data Sharing',
      subtitle: 'Control data sharing settings',
      icon: 'share-social',
      iconType: 'Ionicons',
      screen: 'DataSharingScreen',
      group: 'preferences',
      color: '#F11EE6',
    },
    {
      id: '6',
      title: 'Help & Support',
      subtitle: 'Get help when you need it',
      icon: 'help-circle',
      iconType: 'Ionicons',
      screen: 'HelpSupportScreen',
      group: 'preferences',
      color: '#1ECAF1',
    },
    {
      id: '7',
      title: 'Logout',
      subtitle: 'Sign out of your account',
      icon: 'logout',
      iconType: 'MaterialIcons',
      screen: 'Logout',
      group: 'preferences',
      color: '#EF4444',
    },
    {
      id: '8',
      title: 'FAQs',
      subtitle: 'Frequently asked questions',
      icon: 'information-circle',
      iconType: 'Ionicons',
      screen: 'FAQsScreen',
      group: 'support',
      color: '#10B981',
    },
    {
      id: '9',
      title: 'Contact Support',
      subtitle: 'Reach out to our team',
      icon: 'mail',
      iconType: 'Ionicons',
      screen: 'ContactSupportScreen',
      group: 'support',
      color: '#ffd400',
    },
  ];

  const handlePressIn = (index: number) => {
    Animated.spring(scaleValues[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleValues[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

const handleNavigation = (screen: keyof RootStackParamList) => {
  if (screen === 'Logout') {
    Alert.alert(
      'Log Out?',
      'Are you sure you want to sign out? You will need to login again to access your session history.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutCurrentUser();
              await signOut(auth);
              
              Alert.alert("Logged Out Successfully", "See you next time!", [
                {
                  text: "Close",
                  onPress: () => {
                    navigation?.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    });
                  },
                },
              ]);
            } catch (error) {
              Alert.alert(
                "Logout Failed",
                error instanceof Error ? error.message : "Could not sign you out. Please try again."
              );
            }
          },
        },
      ]
    );
  } else {
    console.log(`Navigate to ${screen}`);
    navigation?.navigate(screen);
  }
};

const renderIcon = (iconType: 'Ionicons' | 'MaterialIcons', iconName: string, color: string) => {
  if (iconType === 'MaterialIcons') {
    return <MaterialIcons name={iconName as any} size={24} color={color} />;
  }
  return <Ionicons name={iconName as any} size={24} color={color} />;
};

const renderSettingItem = (item: SettingOption, index: number) => (
  <Animated.View
    key={item.id}
    style={[
      styles.settingItemWrapper,
      { transform: [{ scale: scaleValues[index] }] },
    ]}
  >
    <TouchableOpacity
      style={styles.settingItem}
      onPress={() => handleNavigation(item.screen)}
      onPressIn={() => handlePressIn(index)}
      onPressOut={() => handlePressOut(index)}
      activeOpacity={1}
    >
      <View style={styles.settingItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          {renderIcon(item.iconType, item.icon, '#FFFFFF')}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingItemText}>{item.title}</Text>
          <Text style={styles.settingItemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  </Animated.View>
);

const mainGroup = settingsOptions.filter((item) => item.group === 'main');
const preferencesGroup = settingsOptions.filter(
  (item) => item.group === 'preferences'
);
const supportGroup = settingsOptions.filter((item) => item.group === 'support');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      {/* Header with Gradient Effect */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.settingsIconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Settings Group */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>ACCOUNT</Text>
          {mainGroup.map((item, index) => renderSettingItem(item, index))}
        </View>

        {/* Preferences Group */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>PREFERENCES</Text>
          {preferencesGroup.map((item, index) =>
            renderSettingItem(item, index + mainGroup.length)
          )}
        </View>

        {/* Support Group */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>SUPPORT</Text>
          {supportGroup.map((item, index) =>
            renderSettingItem(item, index + mainGroup.length + preferencesGroup.length)
          )}
        </View>

        {/* App version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2026 STEM Cognitive Cubes</Text>
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  settingsIconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  settingsGroup: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItemWrapper: {
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  settingItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingItemSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  chevronContainer: {
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  copyrightText: {
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },

});

export default SettingsScreen;







