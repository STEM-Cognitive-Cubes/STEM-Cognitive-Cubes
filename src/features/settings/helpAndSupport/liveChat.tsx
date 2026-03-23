import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootStackParamList } from "../../../navigation/types";
import { sendSupportChatMessage, useSupportChat } from "./helpSupportService";

type Props = NativeStackScreenProps<RootStackParamList, "ChatScreen">;

export default function ChatScreen({ navigation }: Props) {
  const { messages, loading, error } = useSupportChat();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) {
      return;
    }

    const nextText = inputText;
    setInputText("");
    setIsSending(true);

    try {
      await sendSupportChatMessage(nextText);
    } catch {
      setInputText(nextText);
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
        <Text style={styles.headerTitle}>Live Chat</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.messages}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#9333EA" />
              <Text style={styles.loadingText}>Loading conversation...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            messages.map((message) => {
              const isUser = message.sender === "You";
              return (
                <View
                  key={message.id}
                  style={[styles.messageRow, isUser && styles.messageRowUser]}
                >
                  <View style={[styles.messageBubble, isUser && styles.messageBubbleUser]}>
                    <Text style={[styles.messageSender, isUser && styles.messageSenderUser]}>
                      {message.sender}
                    </Text>
                    <Text style={[styles.messageBody, isUser && styles.messageBodyUser]}>
                      {message.body}
                    </Text>
                    <Text style={[styles.messageTime, isUser && styles.messageTimeUser]}>
                      {message.createdAtLabel}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isSending) && styles.sendButtonDisabled,
            ]}
            disabled={!inputText.trim() || isSending}
            onPress={handleSend}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  flex: {
    flex: 1,
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
  messages: {
    padding: 16,
    gap: 12,
  },
  loadingWrap: {
    alignItems: "center",
    paddingTop: 24,
  },
  loadingText: {
    marginTop: 8,
    color: "#6B7280",
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderRadius: 16,
    padding: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "82%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },
  messageBubbleUser: {
    backgroundColor: "#9333EA",
  },
  messageSender: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 4,
  },
  messageSenderUser: {
    color: "#E9D5FF",
  },
  messageBody: {
    color: "#1F2937",
    fontSize: 15,
    lineHeight: 21,
  },
  messageBodyUser: {
    color: "#FFFFFF",
  },
  messageTime: {
    marginTop: 8,
    color: "#9CA3AF",
    fontSize: 11,
  },
  messageTimeUser: {
    color: "#E9D5FF",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#9333EA",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
});
