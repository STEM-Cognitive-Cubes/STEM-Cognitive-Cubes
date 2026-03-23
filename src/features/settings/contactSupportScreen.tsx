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

type Props = NativeStackScreenProps<RootStackParamList, "ContactSupportScreen">;

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
    flex: 1,
  },
  content: {
    padding: 16,
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
