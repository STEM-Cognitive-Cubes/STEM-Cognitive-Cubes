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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Account: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ChangePasswordScreenProps {
  navigation?: NavigationProp;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password validation
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    };
  };

  const passwordValidation = validatePassword(newPassword);
//logic for update password
  const handleUpdatePassword = async () => {
    // Validation
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (!passwordValidation.isValid) {
      Alert.alert('Error', 'New password does not meet all requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Password updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Password updated');
              navigation?.goBack();
            },
          },
        ]
      );
    }, 1500);
  };

  const handleCancel = () => {
    navigation?.goBack();
  };

return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={60} color="#9333EA" />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Your new password must be different from{'\n'}previously used passwords.
        </Text>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter new password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          {newPassword.length > 0 && (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password requirements:</Text>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordValidation.hasMinLength ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={passwordValidation.hasMinLength ? '#10B981' : '#EF4444'}
                />
                <Text style={[
                  styles.requirementText,
                  passwordValidation.hasMinLength && styles.requirementMet
                ]}>
                  At least 8 characters
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordValidation.hasUpperCase ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={passwordValidation.hasUpperCase ? '#10B981' : '#EF4444'}
                />
                <Text style={[
                  styles.requirementText,
                  passwordValidation.hasUpperCase && styles.requirementMet
                ]}>
                  One uppercase letter
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordValidation.hasLowerCase ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={passwordValidation.hasLowerCase ? '#10B981' : '#EF4444'}
                />
                <Text style={[
                  styles.requirementText,
                  passwordValidation.hasLowerCase && styles.requirementMet
                ]}>
                  One lowercase letter
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordValidation.hasNumber ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={passwordValidation.hasNumber ? '#10B981' : '#EF4444'}
                />
                <Text style={[
                  styles.requirementText,
                  passwordValidation.hasNumber && styles.requirementMet
                ]}>
                  One number
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={passwordValidation.hasSpecialChar ? 'checkmark-circle' : 'close-circle'}
                  size={16}
                  color={passwordValidation.hasSpecialChar ? '#10B981' : '#EF4444'}
                />
                <Text style={[
                  styles.requirementText,
                  passwordValidation.hasSpecialChar && styles.requirementMet
                ]}>
                  One special character
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdatePassword}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <Text style={styles.updateButtonText}>Updating...</Text>
            ) : (
              <Text style={styles.updateButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
