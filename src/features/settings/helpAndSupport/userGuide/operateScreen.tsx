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
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  UserGuideScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OperateScreenProps {
  navigation: NavigationProp;
}

interface OperationStep {
  id: string;
  title: string;
  description: string;
  isExpanded: boolean;
}

const OperateScreen: React.FC<OperateScreenProps> = ({ navigation }) => {
  const [steps, setSteps] = useState<OperationStep[]>([
    {
      id: '1',
      title: 'Starting a Play Session',
      description: 'Tap "Start Session" on the dashboard. Ensure cubes are powered on and connected (green indicator). Place cubes within the designated play area (1-2 meters from hub).',
      isExpanded: true,
    },
    {
      id: '2',
      title: 'During a Session',
      description: 'The app runs in the background. No interaction needed! Every block connection is automatically recorded. Session timer shows elapsed time.',
      isExpanded: false,
    },
    {
      id: '3',
      title: 'Ending a Session',
      description: 'Tap "End Session" when playtime is over. The app processes the data and generates a session summary on the next screen.',
      isExpanded: false,
    },
  ]);

  const toggleStep = (id: string) => {
    setSteps(steps.map(step =>
      step.id === id
        ? { ...step, isExpanded: !step.isExpanded }
        : step
    ));
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
        <Text style={styles.headerTitle}>How to Operate</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Operation Steps */}
        {steps.map((step) => (
          <View key={step.id} style={styles.stepCard}>
            <TouchableOpacity
              style={styles.stepHeader}
              onPress={() => toggleStep(step.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Ionicons
                name={step.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#9333EA"
              />
            </TouchableOpacity>

            {step.isExpanded && (
              <View style={styles.stepContent}>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Return Button */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.returnButtonText}>Return</Text>
        </TouchableOpacity>
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
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  stepDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  returnButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default OperateScreen;
