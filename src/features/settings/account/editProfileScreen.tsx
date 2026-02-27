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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Account: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EditProfileScreenProps {
  navigation?: NavigationProp;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation }) => {
  const [fullName, setFullName] = useState('Diseni Jayawardhana');
  const [email, setEmail] = useState('diseni.jayawardhana@gmail.com');
  const [phone, setPhone] = useState('+94 77 123 4567');
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    navigation?.goBack();
  };
  const handleSaveChanges = async () => {
    // Validation
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Profile updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('Profile updated');
              // navigation?.goBack();
            },
          },
        ]
      );
    }, 1500);
  };
