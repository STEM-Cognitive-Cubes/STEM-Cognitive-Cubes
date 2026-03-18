import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  UserGuideScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AppFeaturesScreenProps {
  navigation: NavigationProp;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons';
  isExpanded: boolean;
}

const AppFeaturesScreen: React.FC<AppFeaturesScreenProps> = ({ navigation }) => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: '1',
      title: 'Real-Time Session Tracking',
      description: 'Each block contains sensors that detect connections. When blocks connect, data is transmitted to the central hub, creating a 3D model of structures and analyzing building patterns',
      icon: 'timer',
      iconType: 'Ionicons',
      isExpanded: false,
    },
    {
      id: '2',
      title: '3D Structure Visualization',
      description: 'View a digital replica of physical structures. Rotate, zoom, and replay the building process step-by-step to understand thought patterns',
      icon: 'cube-outline',
      iconType: 'Ionicons',
      isExpanded: false,
    },
    {
      id: '3',
      title: 'Smart Development Insights',
      description: 'Receive personalized recommendations based on building patterns. Example: "Emma shows strong spatial awareness - try introducing puzzle games!"',
      icon: 'bulb',
      iconType: 'Ionicons',
      isExpanded: true,
    },
    {
      id: '4',
      title: 'Progress Reports',
      description: 'Generate weekly/monthly PDF reports showing development trends, achievements, and recommendations',
      icon: 'document-text',
      iconType: 'Ionicons',
      isExpanded: false,
    },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(feature =>
      feature.id === id
        ? { ...feature, isExpanded: !feature.isExpanded }
        : feature
    ));
  };

  const renderIcon = (iconType: 'Ionicons' | 'MaterialCommunityIcons', iconName: string) => {
    if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName as any} size={24} color="#6B7280" />;
    }
    return <Ionicons name={iconName as any} size={24} color="#6B7280" />;
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
        <Text style={styles.headerTitle}>App Features</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Features List */}
        {features.map((feature) => (
          <View key={feature.id} style={styles.featureCard}>
            <TouchableOpacity
              style={styles.featureHeader}
              onPress={() => toggleFeature(feature.id)}
              activeOpacity={0.7}
            >
              <View style={styles.featureTitleContainer}>
                {renderIcon(feature.iconType, feature.icon)}
                <Text style={[
                  styles.featureTitle,
                  feature.isExpanded && styles.featureTitleExpanded
                ]}>
                  {feature.title}
                </Text>
              </View>
              <Ionicons
                name={feature.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#9333EA"
              />
            </TouchableOpacity>

            {feature.isExpanded && (
              <View style={styles.featureContent}>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            )}
          </View>
        ))}
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
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  featureTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  featureTitleExpanded: {
    color: '#1F2937',
  },
  featureContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 52,
  },
  featureDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
});

export default AppFeaturesScreen;
