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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NotificationPreferencesScreenProps {
  navigation: NavigationProp;
}

const NotificationPreferencesScreen: React.FC<NotificationPreferencesScreenProps> = ({ navigation }) => {
  const [enableAll, setEnableAll] = useState(true);
  const [batteryAlerts, setBatteryAlerts] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [milestoneMoments, setMilestoneMoments] = useState(true);
  const [parentingTips, setParentingTips] = useState(false);

  const handleEnableAll = (value: boolean) => {
    setEnableAll(value);
    if (!value) {
      setBatteryAlerts(false);
      setConnectionStatus(false);
      setMilestoneMoments(false);
      setParentingTips(false);
    }
  };

