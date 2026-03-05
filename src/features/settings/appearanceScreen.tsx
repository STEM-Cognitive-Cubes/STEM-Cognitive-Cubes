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

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/types';

type AppearanceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AppearanceScreen'
>;
//logic and state setup
const AppearanceScreen: React.FC<AppearanceScreenProps> = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('dark');
  const [largerText, setLargerText] = useState(false);
  const [selectedIconColor, setSelectedIconColor] = useState<string>('#9333EA');

  const iconColors = [
    { id: '1', color: '#9333EA', name: 'Purple' },
    { id: '2', color: '#F59E0B', name: 'Orange' },
    { id: '3', color: '#EF4444', name: 'Red' },
    { id: '4', color: '#EC4899', name: 'Pink' },
  ];
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
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>THEME</Text>

          <TouchableOpacity
            style={[
              styles.themeOption,
              selectedTheme === 'dark' && styles.themeOptionSelected,
            ]}
            onPress={() => setSelectedTheme('dark')}
            activeOpacity={0.7}
          >
            <View style={styles.themeContent}>
              <Ionicons name="moon" size={24} color="#9333EA" />
              <View style={styles.themeTextContainer}>
                <Text style={styles.themeTitle}>Dark Mode</Text>
                <Text style={styles.themeSubtitle}>Easier on eyes</Text>
              </View>
            </View>
            {selectedTheme === 'dark' && (
              <Ionicons name="checkmark-circle" size={24} color="#9333EA" />
            )}
          </TouchableOpacity>
        </View>

        {/* Accessibility Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="text" size={24} color="#9333EA" />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Larger Text</Text>
                <Text style={styles.settingSubtitle}>Increase text size</Text>
              </View>
            </View>
            <Switch
              value={largerText}
              onValueChange={setLargerText}
              trackColor={{ false: '#D1D5DB', true: '#C4B5FD' }}
              thumbColor={largerText ? '#9333EA' : '#F3F4F6'}
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>

        {/* App Icon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP ICON</Text>

          <View style={styles.iconColorContainer}>
            {iconColors.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.colorOption,
                  selectedIconColor === item.color && styles.colorOptionSelected,
                ]}
                onPress={() => setSelectedIconColor(item.color)}
                activeOpacity={0.7}
              >
                <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
//styles
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionSelected: {
    borderColor: '#FDE047',
    backgroundColor: '#FFFBEB',
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeTextContainer: {
    marginLeft: 12,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  themeSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FDE047',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  iconColorContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#9333EA',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default AppearanceScreen;
