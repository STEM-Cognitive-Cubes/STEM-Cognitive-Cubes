import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface Child {
  name: string;
  age: string;
}

const CARD_COLORS = ['#FDE047', '#BBF7D0', '#BFDBFE', '#FED7AA'];
const AVATAR_COLORS = ['#F97316', '#16A34A', '#3B82F6', '#EA580C'];

export default function ProfileScreen() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [children, setChildren] = useState<Child[]>([
    { name: 'Sanuki Jayawardhana', age: '5' },
  ]);

  // Get the parent stack navigator (since Profile is inside a Tab navigator)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<any>();

  // Listen for new child data from AddChild screen
  useEffect(() => {
    if (route.params?.newChild) {
      const { name, age } = route.params.newChild;
      setChildren(prev => [...prev, { name, age }]);
      // Clear the params so it doesn't re-add on re-render
      navigation.setParams({ newChild: undefined } as any);
    }
  }, [route.params?.newChild]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. Profile Header with Stats */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>DJ</Text>
        </View>
        <Text style={styles.userName}>Diseni Jayawardhana</Text>
        <Text style={styles.userEmail}>diseni.jayawardhana@email.com</Text>

        {/* Stats Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>54</Text>
            <Text style={styles.statLabel}>Builds</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={styles.statValue}>20</Text>
            <Text style={styles.statLabel}>Days active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>
      </View>

      {/* 2. Child Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Child Profile</Text>

        {children.map((child, index) => (
          <Pressable key={index} style={[styles.childCard, { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] }]}>
            <View style={[styles.childAvatar, { backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }]}>
              <Text style={styles.childAvatarText}>{child.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childStatus}>Age {child.age}  |  Active</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A855F7" />
          </Pressable>
        ))}

        {/* Button to navigate to Add Child Screen */}
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate('AddChild')}
        >
          <Ionicons name="person-add-outline" size={24} color="#6366F1" />
          <Text style={styles.addButtonText}>Add Another Child</Text>
        </Pressable>
      </View>

      {/* 3. Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingsIconContainer}>
            <Ionicons name="notifications-outline" size={24} color="#60A5FA" />
          </View>
          <View style={styles.settingsText}>
            <Text style={styles.settingsTitle}>Notifications</Text>
            <Text style={styles.settingsSubtitle}>Daily insights & updates</Text>
          </View>
          <Switch
            trackColor={{ false: "#CBD5E1", true: "#6366F1" }}
            thumbColor="white"
            onValueChange={() => setIsNotificationsEnabled(prev => !prev)}
            value={isNotificationsEnabled}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    backgroundColor: '#A855F7',
    paddingTop: 50, paddingBottom: 30, alignItems: 'center',
  },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    borderWidth: 4, borderColor: '#E9D5FF',
  },
  avatarText: { fontSize: 32, color: '#A855F7', fontWeight: 'bold' },
  userName: { color: 'white', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  userEmail: { color: 'white', opacity: 0.8, fontSize: 14, marginBottom: 20 },
  statsContainer: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20, padding: 15, width: '90%', justifyContent: 'space-around'
  },
  statItem: { alignItems: 'center', flex: 1 },
  statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  statValue: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: 'white', fontSize: 12, opacity: 0.9 },
  section: { padding: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginBottom: 15 },
  childCard: {
    backgroundColor: '#FDE047', flexDirection: 'row', alignItems: 'center',
    padding: 15, borderRadius: 20, marginBottom: 15,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3,
  },
  childAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center'
  },
  childAvatarText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  childInfo: { flex: 1, marginLeft: 15 },
  childName: { fontSize: 16, fontWeight: 'bold', color: '#F97316' },
  childStatus: { fontSize: 12, color: '#92400E' },
  addButton: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1',
    borderRadius: 20, padding: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  addButtonText: { color: '#6366F1', fontWeight: 'bold', marginLeft: 10 },
  settingsCard: {
    backgroundColor: '#FDE047', flexDirection: 'row', alignItems: 'center',
    padding: 15, borderRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.1, elevation: 3
  },
  settingsIconContainer: {
    width: 45, height: 45, borderRadius: 12,
    backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center'
  },
  settingsText: { flex: 1, marginLeft: 15 },
  settingsTitle: { fontWeight: 'bold', fontSize: 16 },
  settingsSubtitle: { fontSize: 12, color: '#64748B' },
});
