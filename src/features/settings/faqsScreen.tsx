import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface FAQsScreenProps {
  navigation: NavigationProp;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'All' | 'Device' | 'App' | 'Account';
  isExpanded: boolean;
}

const FAQsScreen: React.FC<FAQsScreenProps> = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Device' | 'App' | 'Account'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'Cube flashing red?',
      answer: 'This indicates low battery (<15%). Connect the magnetic charger to the cube for at least 30 minutes until the light turns green (fully charged) OR magenta.',
      category: 'Device',
      isExpanded: false,
    },
    {
      id: '2',
      question: 'What skills does this app help develop?',
      answer: 'The app supports the development of problem-solving, spatial awareness, creativity, and logical thinking through structured and free-form block play.',
      category: 'App',
      isExpanded: false,
    },
    {
      id: '3',
      question: 'Is the app safe for the child?',
      answer: 'Yes. The app is designed with child safety in mind and does not collect personal data, unless parents choose to enable certain information. All monitoring is linked to block connection activity only.',
      category: 'App',
      isExpanded: false,
    },
    {
      id: '4',
      question: 'How is the data protected?',
      answer: 'All data is securely stored and accessed only by authorized parent or guardian accounts. We use industry-standard security measures and collect only the minimum data required for functionality.',
      category: 'Account',
      isExpanded: false,
    },
    {
      id: '5',
      question: 'Can multiple children use 1 account?',
      answer: 'Yes. However, creating individual accounts for each child is recommended to keep play data/metrics and progress tracking separate and accurate.',
      category: 'Account',
      isExpanded: false,
    },
    {
      id: '6',
      question: 'Does the cube still work without the app?',
      answer: 'Yes. The cube can still be used for play without the app, but live monitoring, summaries, and alerts will not be available.',
      category: 'Device',
      isExpanded: false,
    },
    {
      id: '7',
      question: 'Will I get notified if something goes wrong?',
      answer: 'Yes. The app sends notifications if unexpected disconnections or system issues are detected, provided notifications are enabled.',
      category: 'App',
      isExpanded: false,
    },
    {
      id: '8',
      question: 'Can the cube be damaged if dropped?',
      answer: 'The cube is designed to withstand normal play, but frequent drops or rough handling may affect internal connections.',
      category: 'Device',
      isExpanded: false,
    },
    {
      id: '9',
      question: 'What happens if the internet connection is lost?',
      answer: 'The system continues basic operation. Once the internet connection is restored, the app synchronizes any recorded data.',
      category: 'Device',
      isExpanded: false,
    },
    {
      id: '10',
      question: 'Can the cubes be used without adult supervision?',
      answer: 'The cubes contain batteries and may pose a choking hazard. We recommend always supervising young children during play. Consult your device manual for age-appropriate guidance.',
      category: 'Device',
      isExpanded: false,
    },
    {
      id: '11',
      question: 'Why am I not receiving notifications?',
      answer: 'Notifications may be disabled in the app or device settings, or the device may be in power-saving mode. Please check notification permissions.',
      category: 'App',
      isExpanded: false,
    },
  ]);

  const categories: Array<'All' | 'Device' | 'App' | 'Account'> = ['All', 'Device', 'App', 'Account'];

  const toggleFAQ = (id: string) => {
    setFaqs(faqs.map(faq =>
      faq.id === id ? { ...faq, isExpanded: !faq.isExpanded } : faq
    ));
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <Text style={styles.headerTitle}>FAQ Hub</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      >
        {/* Search and Filter Section */}
        <View style={styles.stickySection}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for answers..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Category Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Common Questions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMMON QUESTIONS</Text>

          {filteredFAQs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filter</Text>
            </View>
          ) : (
            filteredFAQs.map((faq) => (
              <View key={faq.id} style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={faq.isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color="#9333EA"
                  />
                </TouchableOpacity>

                {faq.isExpanded && (
                  <View style={styles.faqContent}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </View>
            ))
          )}
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
    paddingBottom: 24,
  },
  stickySection: {
    backgroundColor: '#F3F4F6',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  categoriesContainer: {
    marginBottom: 4,
  },
  categoriesContent: {
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#5B46E5',
    borderColor: '#5B46E5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 12,
  },
  faqContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});

export default FAQsScreen;
