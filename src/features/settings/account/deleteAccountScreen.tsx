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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../../navigation/types';
import { deleteCurrentAccount, useAccountProfile } from './accountService';

type Props = NativeStackScreenProps<RootStackParamList, 'DeleteAccount'>;

const DeleteAccountScreen: React.FC<Props> = ({ navigation }) => {
  const { profile } = useAccountProfile();
  const [confirmText, setConfirmText] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePermanentlyDelete = async () => {
    if (confirmText.toUpperCase() !== 'DELETE') {
      Alert.alert('Error', 'Please type "DELETE" to confirm');
      return;
    }

    if (profile?.hasPasswordProvider && !currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    Alert.alert(
      'Final Confirmation',
      'Are you absolutely sure? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);

            try {
              await deleteCurrentAccount(currentPassword);
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                      });
                    },
                  },
                ]
              );
            } catch (error) {
              Alert.alert(
                'Unable to delete account',
                error instanceof Error ? error.message : 'Please try again.'
              );
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <View style={styles.warningCircle}>
            <Ionicons name="warning" size={60} color="#EF4444" />
          </View>
        </View>

        <Text style={styles.warningTitle}>Warning! Permanent Action</Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningBoxTitle}>What you will lose:</Text>
          <View style={styles.warningItem}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.warningItemText}>All your personal data</Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.warningItemText}>Game progress and achievements</Text>
          </View>
          <View style={styles.warningItem}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <Text style={styles.warningItemText}>Access to your account</Text>
          </View>
        </View>

        {profile?.hasPasswordProvider ? (
          <View style={styles.confirmSection}>
            <Text style={styles.confirmTitle}>Current Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter your current password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((value) => !value)}
              >
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.infoBox}>
            <Text style={styles.infoBoxText}>
              This account does not use an email/password login. If Firebase asks
              you to log in again before deletion, please sign in again with your
              original provider and retry.
            </Text>
          </View>
        )}

        <View style={styles.confirmSection}>
          <Text style={styles.confirmTitle}>Type "DELETE" to confirm</Text>
          <TextInput
            style={styles.confirmInput}
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="Type DELETE here"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.deleteButton,
              confirmText.toUpperCase() !== 'DELETE' && styles.deleteButtonDisabled,
            ]}
            onPress={handlePermanentlyDelete}
            activeOpacity={0.8}
            disabled={isLoading || confirmText.toUpperCase() !== 'DELETE'}
          >
            <Text style={styles.deleteButtonText}>
              {isLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel, keep my account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          This action is irreversible. Once deleted, your account cannot be recovered.
        </Text>
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
  warningCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  warningBox: {
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEE2E2',
    marginBottom: 24,
  },
  warningBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 16,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warningItemText: {
    fontSize: 14,
    color: '#7F1D1D',
    marginLeft: 12,
    flex: 1,
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    marginHorizontal: 20,
    padding: 16,
    marginBottom: 24,
  },
  infoBoxText: {
    color: '#92400E',
    fontSize: 14,
    lineHeight: 20,
  },
  confirmSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  confirmTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  confirmInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1F2937',
    fontWeight: '600',
  },
  eyeButton: {
    paddingLeft: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonDisabled: {
    backgroundColor: '#FCA5A5',
    opacity: 0.6,
  },
  deleteButtonText: {
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
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 32,
    lineHeight: 18,
  },
});

export default DeleteAccountScreen;
