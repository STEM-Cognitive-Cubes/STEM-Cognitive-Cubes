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
  const quickHelp = [
      { id: '1', title: 'Hardware Setup', icon: 'hardware-chip' },
      { id: '2', title: 'App Connection', icon: 'wifi' },
      { id: '3', title: 'Account Issues', icon: 'person-circle' },
    ];
  const handleSendEmail = () => {
      if (!subject.trim() || !message.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      // Simulate sending email
      Alert.alert(
        'Message Sent!',
        'We typically respond within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowEmailForm(false);
              setSubject('');
              setMessage('');
            },
          },
        ]
      );
    };
  const handleOpenEmail = () => {
      Alert.alert('Opened Email App', 'Your default email app has been opened');
      setShowEmailForm(false);
    };

    const renderIcon = (iconType: 'Ionicons' | 'MaterialCommunityIcons', iconName: string, color: string) => {
      if (iconType === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={iconName as any} size={32} color={color} />;
      }
      return <Ionicons name={iconName as any} size={32} color={color} />;
    };

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#9333EA" />

        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Response Time Banner */}
          <View style={styles.bannerCard}>
            <Ionicons name="time" size={24} color="#F59E0B" />
            <Text style={styles.bannerText}>We typically respond within 24 hours.</Text>
          </View>

          {/* Contact Options */}
          <View style={styles.optionsContainer}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionCard, { backgroundColor: option.color }]}
                onPress={option.action}
                activeOpacity={0.8}
              >
                <View style={styles.optionIconContainer}>
                  {renderIcon(option.iconType, option.icon, '#FFFFFF')}
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Help */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>QUICK HELP TOPICS</Text>
            <View style={styles.quickHelpContainer}>
              {quickHelp.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickHelpButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.quickHelpText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Alternative Contact */}
          <View style={styles.alternativeCard}>
            <Ionicons name="call" size={24} color="#9333EA" />
            <Text style={styles.alternativeTitle}>Need urgent help?</Text>
            <Text style={styles.alternativeText}>Call us at: +1 (555) 123-4567</Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL('tel:+15551234567')}
              activeOpacity={0.7}
            >
              <Ionicons name="call" size={18} color="#FFFFFF" />
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Email Form Modal */}
        <Modal
          visible={showEmailForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEmailForm(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Send us a message</Text>
                <TouchableOpacity
                  onPress={() => setShowEmailForm(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subject</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="information-circle-outline" size={20} color="#9CA3AF" />
                      <TextInput
                        style={styles.input}
                        placeholder="I need help with..."
                        placeholderTextColor="#9CA3AF"
                        value={subject}
                        onChangeText={setSubject}
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Message</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Describe your issue..."
                      placeholderTextColor="#9CA3AF"
                      value={message}
                      onChangeText={setMessage}
                      multiline
                      numberOfLines={6}
                      textAlignVertical="top"
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendEmail}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="send" size={18} color="#FFFFFF" />
                    <Text style={styles.sendButtonText}>Send Message</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Chatbot Modal */}
        <Modal
          visible={showChatbot}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowChatbot(false)}
        >
          <View style={styles.chatModalOverlay}>
            <View style={styles.chatModalContent}>
              {/* Chat Header */}
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderLeft}>
                  <View style={styles.botAvatar}>
                    <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                  </View>
                  <View>
                    <Text style={styles.chatHeaderTitle}>BlokC Assistant</Text>
                    <Text style={styles.chatHeaderSubtitle}>Online</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setShowChatbot(false)}
                  style={styles.chatCloseButton}
                >
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              <View style={styles.chatMessages}>
                <View style={styles.botMessageWrapper}>
                  <View style={styles.botMessage}>
                    <Text style={styles.botMessageText}>
                      Hi there! I'm the BlokC Assistant. How can I help you today?
                    </Text>
                  </View>
                </View>

                {/* Quick Action Buttons */}
                <View style={styles.quickActions}>
                  {quickHelp.map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.quickActionButton}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickActionText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Chat Input */}
              <View style={styles.chatInputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                  <Ionicons name="add-circle" size={24} color="#9333EA" />
                </TouchableOpacity>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity style={styles.micButton}>
                  <Ionicons name="mic" size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.chatSendButton}>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Floating Chat Button */}
        <TouchableOpacity
          style={styles.floatingChatButton}
          onPress={() => setShowChatbot(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    );
  };


