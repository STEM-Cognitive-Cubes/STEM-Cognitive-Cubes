import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import BotBubbleFab from "@/components/BotBubbleFab";
import { sendChatMessage } from "@/services/chatbot";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: string[];
};

export default function BotChatScreen() {
  const quickChips = useMemo(
    () => ["How do I connect to Hive?", "What are insights?", "How do I track rewards?"],
    []
  );

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi there! I'm your BlokC assistant. How can I help you today?", sender: "bot" },
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList<Message>>(null);

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || typing) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmedText,
      sender: "user",
    };
    setMessages((prev) => [newMessage, ...prev]); // keep inverted list behavior
    setInputText("");
    setTyping(true);

    try {
      const response = await sendChatMessage(trimmedText, conversationId);
      setConversationId(response.conversationId);

      setTyping(false);
      const botResponse: Message = {
        id: `${Date.now()}-bot`,
        text: response.reply,
        sender: "bot",
        sources: response.sources,
      };
      setMessages((prev) => [botResponse, ...prev]);
    } catch (error) {
      setTyping(false);
      const botResponse: Message = {
        id: `${Date.now()}-error`,
        text:
          error instanceof Error
            ? error.message
            : "The assistant is unavailable right now.",
        sender: "bot",
      };
      setMessages((prev) => [botResponse, ...prev]);
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
        <View style={styles.messageBlock}>
          <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
            <Text style={[styles.msgText, isUser ? styles.userText : styles.botText]}>
              {item.text}
            </Text>
          </View>
          {!isUser && item.sources && item.sources.length > 0 ? (
            <View style={styles.sourcesRow}>
              {item.sources.map((source) => (
                <View key={`${item.id}-${source}`} style={styles.sourceChip}>
                  <Text style={styles.sourceChipText}>{source}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <LinearGradient colors={["#cf92fe", "#A24BFF", "#B860FF"]} style={styles.bg}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BlokC Assistant</Text>
          <Text style={styles.headerSub}>Ask anything about your sessions & insights</Text>

          {/* ✅ SAME floating bot as HomeScreen, but bigger */}
          <View style={styles.orbWrap}>
            <BotBubbleFab
              size={140}            // 👈 bigger hero bot
              mode="inline"         // 👈 IMPORTANT so it's not absolute
              disabled              // 👈 not clickable in header
              containerStyle={styles.heroBotExtra}
            />
          </View>

          {/* Quick chips */}
          <View style={styles.chipsRow}>
            {quickChips.slice(0, 3).map((c) => (
              <Pressable key={c} style={styles.chip} onPress={() => sendMessage(c)}>
                <Text style={styles.chipText}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Chat area */}
        <View style={styles.sheet}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={renderItem}
            inverted
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {typing && (
            <View style={[styles.row, styles.rowLeft]}>
              <View style={[styles.bubble, styles.botBubble]}>
                <Text style={[styles.msgText, styles.botText]}>Typing…</Text>
              </View>
            </View>
          )}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
          >
            <View style={styles.inputRow}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask me anything…"
                placeholderTextColor="rgba(80,100,172,0.55)"
                style={styles.input}
                multiline
              />
              <Pressable style={styles.sendBtn} onPress={() => sendMessage(inputText)}>
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#B860FF" },
  bg: { flex: 1 },

  header: {
    paddingTop: 8,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFE572",
  },
  headerSub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "rgba(255,255,255,0.85)",
  },

  orbWrap: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    height: 170,
  },

  // extra gentle glow feel around the hero bot
  heroBotExtra: {
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    maxWidth: "34%",
  },
  chipText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 12,
  },
  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 10,
  },

  row: { width: "100%", marginVertical: 6 },
  rowLeft: { alignItems: "flex-start" },
  rowRight: { alignItems: "flex-end" },
  messageBlock: {
    maxWidth: "82%",
  },

  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: "rgba(80,100,172,0.10)",
    borderWidth: 1,
    borderColor: "rgba(80,100,172,0.18)",
  },
  userBubble: {
    backgroundColor: "#A24BFF",
  },
  msgText: { fontSize: 14, lineHeight: 20, fontWeight: "700" },
  botText: { color: "rgba(80,100,172,0.95)" },
  userText: { color: "#fff" },
  sourcesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  sourceChip: {
    backgroundColor: "rgba(80,100,172,0.08)",
    borderWidth: 1,
    borderColor: "rgba(80,100,172,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceChipText: {
    color: "rgba(80,100,172,0.8)",
    fontSize: 11,
    fontWeight: "800",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 20,
    backgroundColor: "rgba(80,100,172,0.08)",
    color: "rgba(80,100,172,0.95)",
    fontWeight: "700",
  },
  sendBtn: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#A24BFF",
  },
  sendText: { color: "#fff", fontWeight: "900" },
});
