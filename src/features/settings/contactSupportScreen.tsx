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
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Settings: undefined;
  ChatScreen: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ContactSupportScreenProps {
  navigation: NavigationProp;
}

const ContactSupportScreen: React.FC<ContactSupportScreenProps> = ({ navigation }) => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const contactOptions = [
      {
        id: '1',
        title: 'Message',
        description: 'Send us an email',
        icon: 'mail',
        iconType: 'Ionicons' as const,
        color: '#F59E0B',
        action: () => setShowEmailForm(true),
      },
      {
        id: '2',
        title: 'Chat',
        description: 'Talk to BlokC Assistant',
        icon: 'chatbubbles',
        iconType: 'Ionicons' as const,
        color: '#FBBF24',
        action: () => setShowChatbot(true),
      },
    ];
