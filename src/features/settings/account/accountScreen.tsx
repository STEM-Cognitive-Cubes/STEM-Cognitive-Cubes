import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { doc, onSnapshot } from 'firebase/firestore';

import type { RootStackParamList } from '../../../navigation/types';
import { auth, db } from '../../../services/firebase';

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

type ParentProfileView = {
  name: string;
  email: string;
  phone: string;
  dob: string;
  initials: string;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const AccountScreen: React.FC<Props> = ({ navigation }) => {
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [userData, setUserData] = useState<ParentProfileView>({
    name: 'User',
    email: '',
    phone: 'Not set',
    dob: 'Not set',
    initials: 'U',
  });

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setIsProfileLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'parents', uid),
      (parentDoc) => {
        if (!parentDoc.exists()) {
          const fallbackName = auth.currentUser?.email ?? 'User';
          setUserData({
            name: fallbackName,
            email: auth.currentUser?.email ?? '',
            phone: 'Not set',
            dob: 'Not set',
            initials: getInitials(fallbackName),
          });
          setIsProfileLoading(false);
          return;
        }

        const data = parentDoc.data();

        const firstName = typeof data.firstName === 'string' ? data.firstName.trim() : '';
        const lastName = typeof data.lastName === 'string' ? data.lastName.trim() : '';
        const fullName = typeof data.fullName === 'string' ? data.fullName.trim() : '';

        const resolvedName =
          fullName || `${firstName} ${lastName}`.trim() || auth.currentUser?.email || 'User';

        setUserData({
          name: resolvedName,
          email: typeof data.email === 'string' ? data.email : auth.currentUser?.email ?? '',
          phone: typeof data.phoneNumber === 'string' ? data.phoneNumber : 'Not set',
          dob: typeof data.dateOfBirth === 'string' ? data.dateOfBirth : 'Not set',
          initials: getInitials(resolvedName),
        });

        setIsProfileLoading(false);
      },
      () => {
        setIsProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleChangePassword = () => navigation.navigate('ChangePassword');
  const handleDeleteAccount = () => navigation.navigate('DeleteAccount');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userData.initials}</Text>
            </View>

            <TouchableOpacity
              style={styles.editAvatarButton}
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  'Avatar updates coming soon',
                  'The backend is now connected for account details. Avatar uploads can be added next.'
                )
              }
            >
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userData.name}</Text>
          {isProfileLoading ? <Text style={styles.loadingText}>Loading profile...</Text> : null}

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>PERSONAL INFO</Text>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{userData.name}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MaterialIcons name="email" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData.email || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone || 'Not set'}</Text>
              </View>
            </View>

            <View style={[styles.infoItem, styles.infoItemLast]}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{userData.dob || 'Not set'}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editProfileButtonText}>Edit profile</Text>
          </TouchableOpacity>

          <View style={styles.securitySection}>
            <Text style={styles.sectionTitle}>SECURITY</Text>

            <TouchableOpacity
              style={styles.securityItem}
              onPress={handleChangePassword}
              activeOpacity={0.7}
            >
              <View style={styles.securityLeft}>
                <View style={styles.securityIconContainer}>
                  <Ionicons name="lock-closed" size={20} color="#9333EA" />
                </View>
                <Text style={styles.securityText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.securityItem, styles.securityItemLast]}
              onPress={handleDeleteAccount}
              activeOpacity={0.7}
            >
              <View style={styles.securityLeft}>
                <View style={styles.securityIconContainer}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </View>
                <Text style={styles.securityText}>Delete Account</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {isProfileLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator size="small" color="#9333EA" />
              <Text style={styles.stateText}>Loading your account details...</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#9333EA',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerSpacer: { width: 40 },
  content: { flex: 1 },
  profileSection: { padding: 20 },
  avatarContainer: { alignSelf: 'center', marginBottom: 16, position: 'relative' },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarText: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
  },
  stateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  stateText: { fontSize: 14, color: '#4B5563', textAlign: 'center' },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemLast: { borderBottomWidth: 0 },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoTextContainer: { flex: 1 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#1F2937' },
  editProfileButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  editProfileButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  securitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  securityItemLast: { borderBottomWidth: 0 },
  securityLeft: { flexDirection: 'row', alignItems: 'center' },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityText: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  loadingText: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: -12,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AccountScreen;
