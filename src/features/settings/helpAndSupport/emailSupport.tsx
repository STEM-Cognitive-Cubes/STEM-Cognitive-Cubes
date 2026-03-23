import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/types";
import { submitSupportEmail } from "./helpSupportService";

type Props = NativeStackScreenProps<RootStackParamList, "EmailScreen">;

export default function EmailScreen({ navigation }: Props) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      return;
    }

    setIsSending(true);

    try {
      await submitSupportEmail(subject, message);
      Alert.alert("Support request sent", "Your message has been saved for the support team.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert(
        "Unable to send message",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.infoCard}>
          <Ionicons name="mail-outline" size={32} color="#9333EA" />
          <Text style={styles.infoTitle}>Send a support request</Text>
          <Text style={styles.infoText}>
            This form now saves support requests to the backend so your issue can be tracked.
          </Text>
        </View>

        <Text style={styles.label}>Subject</Text>
        <TextInput
          value={subject}
          onChangeText={setSubject}
          placeholder="Briefly describe the issue"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />

        <Text style={styles.label}>Message</Text>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Explain what happened and what you expected."
          placeholderTextColor="#9CA3AF"
          multiline
          style={[styles.input, styles.messageInput]}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[
            styles.button,
            (!subject.trim() || !message.trim() || isSending) && styles.buttonDisabled,
          ]}
          onPress={handleSend}
          disabled={!subject.trim() || !message.trim() || isSending}
        >
          <Text style={styles.buttonText}>{isSending ? "Sending..." : "Send"}</Text>
        </TouchableOpacity>
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
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 8,
  },
  infoTitle: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  infoText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  label: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111827",
  },
  messageInput: {
    minHeight: 140,
  },
  button: {
    marginTop: 8,
    backgroundColor: "#9333EA",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
