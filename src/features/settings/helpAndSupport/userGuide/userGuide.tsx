import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { width } = Dimensions.get('window');

type RootStackParamList = {
  HelpSupportScreen: undefined;
  ProductIntroScreen: undefined;
  AppFeaturesScreen: undefined;
  OperateScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface UserGuideScreenProps {
  navigation: NavigationProp;
}

interface TutorialSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialIcons';
  color: string;
}

const UserGuideScreen: React.FC<UserGuideScreenProps> = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const tutorialSlides: TutorialSlide[] = [
    {
      id: '1',
      title: 'Welcome to BlokC!',
      description: "Let's get you started with smart building blocks that track your child's cognitive development in real-time.",
      icon: 'hand-right',
      iconType: 'Ionicons',
      color: '#8B5CF6',
    },
    {
      id: '2',
      title: 'Connect Your Smart Blocks',
      description: 'First, turn on your IoT-enabled building blocks in the app via Bluetooth. Make sure blocks are charged and nearby.',
      icon: 'cube',
      iconType: 'Ionicons',
      color: '#8B5CF6',
    },
    {
      id: '3',
      title: 'Start Your First Session',
      description: 'Once connected, you can start tracking every block connection is recorded to identify patterns.',
      icon: 'target',
      iconType: 'Ionicons',
      color: '#8B5CF6',
    },
    {
      id: '4',
      title: 'View Smart Insights',
      description: 'Our smart system analyzes building patterns to provide insights on cognitive development milestones.',
      icon: 'bulb',
      iconType: 'Ionicons',
      color: '#8B5CF6',
    },
    {
      id: '5',
      title: 'Track Progress Over Time',
      description: 'View detailed history, complexity scores, skill tracking, and comprehensive progress reports.',
      icon: 'stats-chart',
      iconType: 'Ionicons',
      color: '#8B5CF6',
    },
  ];

  const guideOptions = [
    {
      id: '1',
      title: 'Product Introduction',
      subtitle: 'Learn about BlokC',
      icon: 'information-circle',
      iconType: 'Ionicons' as const,
      screen: 'ProductIntroScreen' as keyof RootStackParamList,
      color: '#f59042',
    },
    {
      id: '2',
      title: 'App Features',
      subtitle: 'Explore all features',
      icon: 'apps',
      iconType: 'Ionicons' as const,
      screen: 'AppFeaturesScreen' as keyof RootStackParamList,
      color: '#42bcf5',
    },
    {
      id: '3',
      title: 'How to Operate',
      subtitle: 'Step-by-step guide',
      icon: 'play-circle',
      iconType: 'Ionicons' as const,
      screen: 'OperateScreen' as keyof RootStackParamList,
      color: '#f54260',
    },
  ];

  const handleNext = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    }
  };

  const handleGetStarted = () => {
    setCurrentSlide(0);
    flatListRef.current?.scrollToIndex({ index: 0, animated: true });
  };

  const renderTutorialSlide = ({ item, index }: { item: TutorialSlide; index: number }) => (
    <View style={styles.slideContainer}>
      <View style={styles.slideContent}>
        <Text style={styles.slideNumber}>{index + 1} of {tutorialSlides.length}</Text>

        <View style={[styles.slideIconContainer, { backgroundColor: item.color }]}>
          {item.iconType === 'Ionicons' ? (
            <Ionicons name={item.icon as any} size={64} color="#FFFFFF" />
          ) : (
            <MaterialIcons name={item.icon as any} size={64} color="#FFFFFF" />
          )}
        </View>

        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>

        <TouchableOpacity
          style={styles.slideButton}
          onPress={index === tutorialSlides.length - 1 ? handleGetStarted : handleNext}
          activeOpacity={0.7}
        >
          <Text style={styles.slideButtonText}>
            {index === tutorialSlides.length - 1 ? 'Finish Tutorial' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>User Guide</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Interactive Tutorial Card */}
        <View style={styles.tutorialCard}>
          <View style={styles.tutorialHeader}>
            <Ionicons name="play-circle" size={24} color="#9333EA" />
            <Text style={styles.tutorialHeaderText}>Interactive Tutorial</Text>
          </View>
          <Text style={styles.tutorialSubtext}>Swipe to learn the basics of BlokC</Text>

          <FlatList
            ref={flatListRef}
            data={tutorialSlides}
            renderItem={renderTutorialSlide}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const slideIndex = Math.round(event.nativeEvent.contentOffset.x / (width - 72));
              setCurrentSlide(slideIndex);
            }}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            snapToInterval={width - 72}
            decelerationRate="fast"
          />

          {/* Pagination Dots */}
          <View style={styles.paginationContainer}>
            {tutorialSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentSlide === index && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Guide Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DETAILED GUIDES</Text>

          {guideOptions.map((option) => (
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
  tutorialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tutorialHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 8,
  },
  tutorialSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 20,
  },
  slideContainer: {
    width: width - 72,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    width: '100%',
    alignItems: 'center',
  },
  slideNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 20,
  },
  slideIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  slideTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  slideButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
  },
  slideButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  paginationDotActive: {
    backgroundColor: '#9333EA',
    width: 24,
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
});

export default UserGuideScreen;
