import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
  UserGuideScreen: undefined;
  CommunityScreen: undefined;
  EmailScreen: undefined;
  ChatScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HelpSupportScreenProps {
  navigation: NavigationProp;
}

const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  const helpOptions = [
    {
      id: '1',
      title: 'User Guide',
      subtitle: 'Learn the basics of BlokC',
      icon: 'book-outline',
      iconType: 'Ionicons' as const,
      screen: 'UserGuideScreen' as keyof RootStackParamList,
      color: '#9333EA',
    },
    {
      id: '2',
      title: 'Community',
      subtitle: 'Join our community forum',
      icon: 'people',
      iconType: 'Ionicons' as const,
      screen: 'CommunityScreen' as keyof RootStackParamList,
      color: '#4b42f5',
    },
    {
      id: '3',
      title: 'Live Chat',
      subtitle: 'Chat with our support team',
      icon: 'chatbubbles',
      iconType: 'Ionicons' as const,
      screen: 'ChatScreen' as keyof RootStackParamList,
      color: '#f542c5',
    },
    {
      id: '4',
      title: 'Email Support',
      subtitle: 'Send us an email',
      icon: 'mail',
      iconType: 'Ionicons' as const,
      screen: 'EmailScreen' as keyof RootStackParamList,
      color: '#12B886',
    },
  ];

  const renderIcon = (iconType: 'Ionicons' | 'MaterialIcons', iconName: string, color: string) => {
    if (iconType === 'MaterialIcons') {
      return <MaterialIcons name={iconName as any} size={28} color={color} />;
    }
    return <Ionicons name={iconName as any} size={28} color={color} />;
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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeCard}>
          <Ionicons name="help-circle" size={48} color="#9333EA" />
          <Text style={styles.welcomeTitle}>Hello! How can we help?</Text>
          <Text style={styles.welcomeSubtitle}>
            We're here to help you get the most out of your STEM Cognitive Cubes experience
          </Text>
        </View>

        {/* Self Service Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELF SERVICE</Text>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate(helpOptions[0].screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: helpOptions[0].color }]}>
              {renderIcon(helpOptions[0].iconType, helpOptions[0].icon, '#FFFFFF')}
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{helpOptions[0].title}</Text>
              <Text style={styles.optionSubtitle}>{helpOptions[0].subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Contact Us Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>

          {helpOptions.slice(1).map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => navigation.navigate(option.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                {renderIcon(option.iconType, option.icon, '#FFFFFF')}
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  quickLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickLinkCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default HelpSupportScreen;
