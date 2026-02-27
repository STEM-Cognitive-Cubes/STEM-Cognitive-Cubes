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
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface DeleteAccountScreenProps {
  navigation?: NavigationProp;
}

const DeleteAccountScreen: React.FC<DeleteAccountScreenProps> = ({ navigation }) => {
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePermanentlyDelete = async () => {
    // Validation
    if (confirmText.toUpperCase() !== 'DELETE') {
      Alert.alert('Error', 'Please type "DELETE" to confirm');
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

            // Simulate API call
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert(
                'Account Deleted',
                'Your account has been deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      console.log('Account deleted, navigate to login');
                      // navigation?.navigate('Login');
                    },
                  },
                ]
              );
            }, 1500);
          },
        },
      ]
    );
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
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{ width: 40 }} />
      </View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Warning image */}
        <View style={styles.iconContainer}>
          <View style={styles.warningCircle}>
            <Ionicons name="warning" size={60} color="#EF4444" />
          </View>
        </View>

        {/* Warning header */}
        <Text style={styles.warningTitle}>Warning! Permanent Action</Text>

        {/* Warning Message */}
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

        {/* Confirmation Section */}
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

        {/* Action Buttons */}
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
            {isLoading ? (
              <Text style={styles.deleteButtonText}>Deleting...</Text>
            ) : (
              <Text style={styles.deleteButtonText}>Yes, Delete Permanently</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel, keep my account</Text>
          </TouchableOpacity>
        </View>

        {/* Additional Info */}
        <Text style={styles.footerText}>
          This action is irreversible. Once deleted, your account cannot be recovered.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
