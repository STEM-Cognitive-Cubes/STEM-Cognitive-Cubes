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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CommunityScreen'>;

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
  const communityFeatures = [
    {
      id: '1',
      title: 'Weekly Challenge',
      subtitle: 'Join this week\'s building challenge',
      icon: 'trophy',
      iconType: 'Ionicons' as const,
      color: '#F59E0B',
      badge: 'New',
    },
    {
      id: '2',
      title: 'Community Feed',
      subtitle: 'See what other families are building',
      icon: 'people',
      iconType: 'Ionicons' as const,
      color: '#8B5CF6',
      badge: '12 new',
    },
    {
      id: '3',
      title: 'Featured Creations',
      subtitle: 'Amazing builds from our community',
      icon: 'star',
      iconType: 'Ionicons' as const,
      color: '#EC4899',
      badge: null,
    },
    {
      id: '4',
      title: 'Parent Tips',
      subtitle: 'Share and discover parenting insights',
      icon: 'bulb',
      iconType: 'Ionicons' as const,
      color: '#10B981',
      badge: 'Popular',
    },
  ];

  const renderIcon = (iconType: 'Ionicons' | 'MaterialCommunityIcons', iconName: string, color: string) => {
    if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName as any} size={28} color={color} />;
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
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="people" size={32} color="#9333EA" />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Welcome to Our Community!</Text>
            <Text style={styles.bannerText}>
              This community page provides a safe and moderated space for parents to share creations, participate in weekly challenges, view featured creations, and exchange parenting tips, encouraging collaboration, learning, and motivation.
            </Text>
          </View>
        </View>

        {/* Community Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE</Text>

          {communityFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                {renderIcon(feature.iconType, feature.icon, feature.color)}
              </View>
              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  {feature.badge && (
                    <View style={[styles.badge, { backgroundColor: feature.color }]}>
                      <Text style={styles.badgeText}>{feature.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Guidelines */}
        <View style={styles.guidelinesCard}>
          <View style={styles.guidelinesHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#9333EA" />
            <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          </View>

          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Be respectful and supportive</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Share constructive feedback</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Keep content family-friendly</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Protect children's privacy</Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Community Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.5K+</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>850+</Text>
              <Text style={styles.statLabel}>Creations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bannerCard: {
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
  bannerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerContent: {
    gap: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  bannerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
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
  featureCard: {
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
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  guidelinesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9333EA',
  },
  guidelineText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#9333EA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#C4B5FD',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E9D5FF',
    fontWeight: '500',
  },
});

export default CommunityScreen;
      title: 'Community Feed',
      subtitle: 'See what other families are building',
      icon: 'people',
      iconType: 'Ionicons' as const,
      color: '#8B5CF6',
      badge: '12 new',
    },
    {
      id: '3',
      title: 'Featured Creations',
      subtitle: 'Amazing builds from our community',
      icon: 'star',
      iconType: 'Ionicons' as const,
      color: '#EC4899',
      badge: null,
    },
    {
      id: '4',
      title: 'Parent Tips',
      subtitle: 'Share and discover parenting insights',
      icon: 'bulb',
      iconType: 'Ionicons' as const,
      color: '#10B981',
      badge: 'Popular',
    },
  ];

  const renderIcon = (iconType: 'Ionicons' | 'MaterialCommunityIcons', iconName: string, color: string) => {
    if (iconType === 'MaterialCommunityIcons') {
      return <MaterialCommunityIcons name={iconName as any} size={28} color={color} />;
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
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="people" size={32} color="#9333EA" />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Welcome to Our Community!</Text>
            <Text style={styles.bannerText}>
              This community page provides a safe and moderated space for parents to share creations, participate in weekly challenges, view featured creations, and exchange parenting tips, encouraging collaboration, learning, and motivation.
            </Text>
          </View>
        </View>

        {/* Community Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPLORE</Text>

          {communityFeatures.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              activeOpacity={0.7}
            >
              <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                {renderIcon(feature.iconType, feature.icon, feature.color)}
              </View>
              <View style={styles.featureContent}>
                <View style={styles.featureTitleRow}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  {feature.badge && (
                    <View style={[styles.badge, { backgroundColor: feature.color }]}>
                      <Text style={styles.badgeText}>{feature.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Guidelines */}
        <View style={styles.guidelinesCard}>
          <View style={styles.guidelinesHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#9333EA" />
            <Text style={styles.guidelinesTitle}>Community Guidelines</Text>
          </View>

          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Be respectful and supportive</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Share constructive feedback</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Keep content family-friendly</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={styles.guidelineDot} />
              <Text style={styles.guidelineText}>Protect children's privacy</Text>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Community Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.5K+</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>850+</Text>
              <Text style={styles.statLabel}>Creations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  bannerCard: {
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
  bannerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  bannerContent: {
    gap: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  bannerText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
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
  featureCard: {
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
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  featureSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  guidelinesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guidelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9333EA',
  },
  guidelineText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#9333EA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#C4B5FD',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#E9D5FF',
    fontWeight: '500',
  },
});

export default CommunityScreen;
