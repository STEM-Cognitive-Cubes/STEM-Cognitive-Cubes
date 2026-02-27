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
