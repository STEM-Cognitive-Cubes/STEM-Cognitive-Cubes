import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AppearanceScreenProps {
  navigation: NavigationProp;
}
//logic and state setup
const AppearanceScreen: React.FC<AppearanceScreenProps> = ({ navigation }) => {
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('dark');
  const [largerText, setLargerText] = useState(false);
  const [selectedIconColor, setSelectedIconColor] = useState<string>('#9333EA');

  const iconColors = [
    { id: '1', color: '#9333EA', name: 'Purple' },
    { id: '2', color: '#F59E0B', name: 'Orange' },
    { id: '3', color: '#EF4444', name: 'Red' },
    { id: '4', color: '#EC4899', name: 'Pink' },
  ];
