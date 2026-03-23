import React, { useMemo, useState } from 'react';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../navigation/types';
import { changeAccountPassword, useAccountProfile } from './accountService';

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

const ChangePasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { profile } = useAccountProfile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordValidation = useMemo(() => {
    const hasMinLength = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      isValid:
        hasMinLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar,
    };
  }, [newPassword]);

  const handleUpdatePassword = async () => {
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

    try {
      await changeAccountPassword(currentPassword, newPassword);
      Alert.alert('Success', 'Password updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to update password',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={60} color="#9333EA" />
          </View>
        </View>

        <Text style={styles.description}>
          Your new password must be different from{'\n'}previously used passwords.
        </Text>

        {!profile?.hasPasswordProvider ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              This account was created with a non-password sign-in provider, so
              password changes are not available from this screen.
            </Text>
          </View>
        ) : null}

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
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
                onPress={() => setShowCurrentPassword((value) => !value)}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
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
                onPress={() => setShowNewPassword((value) => !value)}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#6B7280"
                style={styles.inputIcon}
              />
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
                onPress={() => setShowConfirmPassword((value) => !value)}
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

          {newPassword.length > 0 ? (
            <View style={styles.requirementsContainer}>
              <Text style={styles.requirementsTitle}>Password requirements:</Text>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    passwordValidation.hasMinLength
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={passwordValidation.hasMinLength ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    passwordValidation.hasMinLength && styles.requirementMet,
                  ]}
                >
                  At least 8 characters
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    passwordValidation.hasUpperCase
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={passwordValidation.hasUpperCase ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    passwordValidation.hasUpperCase && styles.requirementMet,
                  ]}
                >
                  One uppercase letter
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    passwordValidation.hasLowerCase
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={passwordValidation.hasLowerCase ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    passwordValidation.hasLowerCase && styles.requirementMet,
                  ]}
                >
                  One lowercase letter
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    passwordValidation.hasNumber
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={passwordValidation.hasNumber ? '#10B981' : '#EF4444'}
                />
                <Text
                  style={[
                    styles.requirementText,
                    passwordValidation.hasNumber && styles.requirementMet,
                  ]}
                >
                  One number
                </Text>
              </View>

              <View style={styles.requirementItem}>
                <Ionicons
                  name={
                    passwordValidation.hasSpecialChar
                      ? 'checkmark-circle'
                      : 'close-circle'
                  }
                  size={16}
                  color={
                    passwordValidation.hasSpecialChar ? '#10B981' : '#EF4444'
                  }
                />
                <Text
                  style={[
                    styles.requirementText,
                    passwordValidation.hasSpecialChar && styles.requirementMet,
                  ]}
                >
                  One special character
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.updateButton,
              !profile?.hasPasswordProvider && styles.buttonDisabled,
            ]}
            onPress={handleUpdatePassword}
            activeOpacity={0.8}
            disabled={isLoading || !profile?.hasPasswordProvider}
          >
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 20,
  },
  infoBoxText: {
    color: '#92400E',
    fontSize: 14,
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  requirementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#047857',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  updateButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default ChangePasswordScreen;
