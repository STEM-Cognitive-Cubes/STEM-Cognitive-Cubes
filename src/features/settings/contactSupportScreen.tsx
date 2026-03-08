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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    backgroundColor: '#9333EA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
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
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FDE047',
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  optionIconContainer: {
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  quickHelpContainer: {
    gap: 12,
  },
  quickHelpButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  quickHelpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  alternativeCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlignVertical: 'top',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5B46E5',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  floatingChatButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5B46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  chatModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  chatModalContent: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#9333EA',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatHeaderSubtitle: {
    fontSize: 12,
    color: '#E9D5FF',
  },
  chatCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
  },
  botMessageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  quickActions: {
    gap: 12,
    marginTop: 16,
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
    textAlign: 'center',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  attachButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  micButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatSendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactSupportScreen;

