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

interface ProductIntroScreenProps {
  navigation: NavigationProp;
}

interface AccordionSection {
  id: string;
  title: string;
  content: string;
  isExpanded: boolean;
}

const ProductIntroScreen: React.FC<ProductIntroScreenProps> = ({ navigation }) => {
  const [sections, setSections] = useState<AccordionSection[]>([
    {
      id: '1',
      title: 'What is BlokC?',
      content: "BlokC is an IoT-enabled building block system designed to capture and analyze your child's play patterns, generating meaningful insights for parents and educators about cognitive development",
      isExpanded: true,
    },
    {
      id: '2',
      title: 'Key Features?',
      content: 'Real-time 3D structure visualization, AI-powered development insights, pattern recognition, complexity scoring, skill tracking, and comprehensive progress reports.',
      isExpanded: false,
    },
    {
      id: '3',
      title: 'How it works?',
      content: 'Each block contains sensors that detect connections. When blocks connect, data is transmitted to the central hub, creating a 3D model of structures and analyzing building patterns',
      isExpanded: false,
    },
  ]);

  const toggleSection = (id: string) => {
    setSections(sections.map(section =>
      section.id === id
        ? { ...section, isExpanded: !section.isExpanded }
        : section
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
        <Text style={styles.headerTitle}>Product Introduction</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Accordion Sections */}
        {sections.map((section) => (
          <View key={section.id} style={styles.accordionItem}>
            <TouchableOpacity
              style={styles.accordionHeader}
              onPress={() => toggleSection(section.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.accordionTitle}>{section.title}</Text>
              <Ionicons
                name={section.isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#9333EA"
              />
            </TouchableOpacity>

            {section.isExpanded && (
              <View style={styles.accordionContent}>
                <Text style={styles.accordionText}>{section.content}</Text>
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
  accordionItem: {
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
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  accordionContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  accordionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  returnButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProductIntroScreen;
