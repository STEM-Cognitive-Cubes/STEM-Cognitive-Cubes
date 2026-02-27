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
