<<<<<<< HEAD
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
=======
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../navigation/types";
import { useSupportOverview } from "./helpAndSupport/helpSupportService";
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)

type RootStackParamList = {
  Settings: undefined;
  ChatScreen: undefined;
};

<<<<<<< HEAD
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact</Text>
        <View style={styles.iconButton} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Response Time Banner */}
        <View style={styles.banner}>
          <Ionicons name="time" size={24} color="#F59E0B" />
          <Text style={styles.bannerText}>We typically respond within 24 hours.</Text>
        </View>

        {/* Contact Options */}
        <View style={styles.optionsRow}>
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, { backgroundColor: option.color }]}
              onPress={option.action}
              activeOpacity={0.8}
            >
              {renderIcon(option.iconType, option.icon, '#FFFFFF')}
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDesc}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK HELP TOPICS</Text>
          {quickHelp.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.helpButton}
              activeOpacity={0.7}
            >
              <Text style={styles.helpText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Alternative Contact */}
        <View style={styles.card}>
          <Ionicons name="call" size={24} color="#9333EA" />
          <Text style={styles.cardTitle}>Need urgent help?</Text>
          <Text style={styles.cardText}>Call us at: +1 (555) 123-4567</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => Linking.openURL('tel:+15551234567')}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={18} color="#FFFFFF" />
            <Text style={styles.buttonText}>Call Now</Text>
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
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send us a message</Text>
              <TouchableOpacity
                onPress={() => setShowEmailForm(false)}
                style={styles.iconButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Subject</Text>
                  <View style={styles.inputRow}>
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
                  style={styles.primaryButton}
                  onPress={handleSendEmail}
                  activeOpacity={0.7}
                >
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.buttonText}>Send Message</Text>
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
        <View style={styles.chatOverlay}>
          <View style={styles.chatModal}>
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <View style={styles.avatar}>
                  <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.chatTitle}>BlokC Assistant</Text>
                  <Text style={styles.chatSubtitle}>Online</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowChatbot(false)}
                style={styles.iconButton}
              >
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Chat Messages */}
            <View style={styles.chatContent}>
              <View style={styles.message}>
                <Text style={styles.messageText}>
                  Hi there! I'm the BlokC Assistant. How can I help you today?
                </Text>
              </View>

              {/* Quick Actions */}
              <View style={styles.actions}>
                {quickHelp.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.actionButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Chat Input */}
            <View style={styles.chatInput}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="add-circle" size={24} color="#9333EA" />
              </TouchableOpacity>
              <TextInput
                style={styles.chatField}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="mic" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendButton}>
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowChatbot(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  flex: {
=======
export default function ContactSupportScreen({ navigation }: Props) {
  const { tickets, loading, error, openTickets } = useSupportOverview();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryEyebrow}>SUPPORT STATUS</Text>
          <Text style={styles.summaryValue}>{openTickets}</Text>
          <Text style={styles.summaryText}>
            open {openTickets === 1 ? "request" : "requests"} linked to your account
          </Text>
        </View>

        <View style={styles.channelCard}>
          <Text style={styles.channelTitle}>Available support paths</Text>
          <Text style={styles.channelText}>Email support: tracked through the in-app form</Text>
          <Text style={styles.channelText}>Live chat: saved as a running conversation</Text>
          <Text style={styles.channelText}>Expected response: next available support window</Text>
        </View>

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Recent requests</Text>

          {loading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator size="small" color="#9333EA" />
              <Text style={styles.stateText}>Loading support history...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : tickets.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateText}>
                No requests yet. Use Email Support or Live Chat to contact the team.
              </Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <View key={ticket.id} style={styles.ticketCard}>
                <View style={styles.ticketHeader}>
                  <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                  <Text
                    style={[
                      styles.ticketStatus,
                      ticket.status === "open" ? styles.ticketStatusOpen : styles.ticketStatusClosed,
                    ]}
                  >
                    {ticket.status.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.ticketMessage}>{ticket.message}</Text>
                <Text style={styles.ticketTimestamp}>{ticket.createdAtLabel}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#9333EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)
    flex: 1,
  },
  content: {
    padding: 16,
<<<<<<< HEAD
    paddingBottom: 80,
  },

  // Header
  header: {
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  // Reusable
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Banner
  banner: {
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

  // Options
  optionsRow: {
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
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Section
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
  helpButton: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  // Card
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
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

  // Form
  form: {
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
  inputRow: {
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

  // Floating Button
  fab: {
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

  // Chat Modal
  chatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  chatModal: {
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#E9D5FF',
  },
  chatContent: {
    flex: 1,
    padding: 16,
  },
  message: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '80%',
    marginBottom: 16,
  },
  messageText: {
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9333EA',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9333EA',
    textAlign: 'center',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  chatField: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1F2937',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactSupportScreen;
=======
    gap: 16,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  summaryEyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#6B7280",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  channelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  channelText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 8,
  },
  historySection: {
    gap: 12,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    color: "#6B7280",
  },
  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  stateText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#B91C1C",
    textAlign: "center",
  },
  ticketCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  ticketSubject: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  ticketStatus: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  ticketStatusOpen: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  ticketStatusClosed: {
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
  },
  ticketMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 10,
  },
  ticketTimestamp: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
>>>>>>> 9729566 (feat(settings): add backend for account, preferences, and support flows)
