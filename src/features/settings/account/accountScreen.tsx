import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
};
const AccountScreen = ({ navigation }) => {
  // Dummy data for now until we connect the backend
  const [userData] = useState({
    name: 'Diseni Jayawardhana',
    email: 'diseni.jayawardhana@gmail.com',
    phone: '+94 77 123 4567',
    dob: '15/03/2005',
    initials: 'DJ',
  });

  const handleEditProfile = () => navigation?.navigate('EditProfile');
  const handleChangePassword = () => navigation?.navigate('ChangePassword');
  const handleDeleteAccount = () => navigation?.navigate('DeleteAccount');

return (
  <SafeAreaView style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Account</Text>
      <View style={{ width: 40 }} />
    </View>

 <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userData.initials}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userData.name}</Text>

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
                <Text style={styles.infoValue}>{userData.email}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData.phone}</Text>
              </View>
            </View>

            <View style={[styles.infoItem, { borderBottomWidth: 0 }]}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="calendar" size={20} color="#9333EA" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{userData.dob}</Text>
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

            {/* Delete Account */}
            <TouchableOpacity
              style={[styles.securityItem, { borderBottomWidth: 0 }]}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
