import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "@/navigation/types";
import {
  createLiveSession,
  getLatestEndedSessionPreview,
  type LatestEndedSessionPreview,
} from "@/services/sessionPlayback";

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.trunc(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function formatEndedAt(date?: Date) {
  if (!date) {
    return "Recently";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function StartSessionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [latestEndedSession, setLatestEndedSession] =
    useState<LatestEndedSessionPreview | null>(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const loadLatestEndedSession = useCallback(async () => {
    setIsLoadingLatest(true);
    try {
      const latest = await getLatestEndedSessionPreview();
      setLatestEndedSession(latest);
    } catch (error) {
      console.error("Failed to fetch latest ended session", error);
      setLatestEndedSession(null);
    } finally {
      setIsLoadingLatest(false);
    }
  }, []);

  useEffect(() => {
    loadLatestEndedSession();
    const unsubscribe = navigation.addListener("focus", loadLatestEndedSession);
    return unsubscribe;
  }, [loadLatestEndedSession, navigation]);

  const handleStartSession = async () => {
    setStartError(null);
    setIsStartingSession(true);
    try {
      const { sessionId } = await createLiveSession();
      navigation.navigate("LiveSession", {
        mode: "live",
        sessionId,
      });
    } catch (error) {
      console.error("Could not start session", error);
      setStartError("Could not start a new session. Please try again.");
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleReplayLast = () => {
    if (!latestEndedSession) {
      return;
    }

    navigation.navigate("LiveSession", {
      mode: "replay",
      sessionId: latestEndedSession.sessionId,
      playbackJsonPath: latestEndedSession.playbackJsonPath,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Play Session</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>Session Preparation</Text>
          <Text style={styles.sectionSub}>Set up your blocks before starting</Text>

          <View style={styles.whiteCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text style={styles.infoText}>Before you start</Text>
            </View>

            <CheckItem label="Ensure all cubes are powered on" />
            <CheckItem label="Place cubes within the designated play area" />
            <CheckItem label="Clear the area of other magnetic toys" />
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>System Status</Text>
          <View style={styles.whiteCard}>
            <View style={styles.statusRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="bluetooth" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Cube connectivity</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
                <Text style={styles.connectedText}>Connected</Text>
              </View>
            </View>

            <View style={[styles.statusRow, { marginTop: 20 }]}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="battery-charging" size={24} color="black" />
              </View>
              <View style={{ flex: 1, marginLeft: 15 }}>
                <Text style={styles.statusTitle}>Battery status</Text>
              </View>
              <Text style={styles.batteryPercent}>85%</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>Last Ended Session</Text>
          <View style={styles.whiteCard}>
            {isLoadingLatest ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#6D5AAE" />
                <Text style={styles.loadingText}>Loading last session...</Text>
              </View>
            ) : latestEndedSession ? (
              <>
                <Text style={styles.previewTitle}>
                  Session #{latestEndedSession.sessionId.slice(0, 6)}
                </Text>
                <Text style={styles.previewMeta}>
                  Ended: {formatEndedAt(latestEndedSession.endedAt)}
                </Text>
                <Text style={styles.previewMeta}>
                  Duration: {formatDuration(latestEndedSession.durationSeconds)}
                </Text>
                <Text style={styles.previewMeta}>
                  Events captured: {latestEndedSession.eventCount}
                </Text>

                <TouchableOpacity style={styles.replayButton} onPress={handleReplayLast}>
                  <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                  <Text style={styles.replayButtonText}>Replay Last Session</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.emptyText}>
                No completed session yet. Once you end a session, its JSON playback will appear
                here.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.readyFooter}>
          <Text style={styles.readyText}>
            System is ready. You may now allow the child to begin playing.
          </Text>

          <TouchableOpacity
            style={[styles.startBtn, isStartingSession && styles.startBtnDisabled]}
            disabled={isStartingSession}
            onPress={handleStartSession}
          >
            {isStartingSession ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.startBtnText}>Start Session</Text>
            )}
          </TouchableOpacity>

          {startError ? <Text style={styles.errorText}>{startError}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const CheckItem = ({ label }: { label: string }) => (
  <View style={styles.checkRow}>
    <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
    <Text style={styles.checkText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#7D67D2" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    alignItems: "center",
    paddingTop: 40,
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  sectionWrapper: { backgroundColor: "#E5D9E8", borderRadius: 30, padding: 18, marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: "bold", color: "#4A4A8E" },
  sectionSub: { fontSize: 12, color: "#888", marginBottom: 12 },
  whiteCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  infoText: { fontWeight: "bold", marginLeft: 10, color: "#333" },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  checkText: { marginLeft: 12, fontSize: 14, color: "#444", flex: 1 },
  statusRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    backgroundColor: "#F0F0F0",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  statusTitle: { fontWeight: "bold", fontSize: 16, color: "#333" },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FFF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#4ADE80",
  },
  connectedText: { color: "#4ADE80", fontWeight: "bold", fontSize: 12, marginLeft: 5 },
  batteryPercent: { color: "#4ADE80", fontWeight: "bold", fontSize: 16 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  loadingText: { color: "#4B5563", fontSize: 14 },
  previewTitle: { color: "#1F2937", fontSize: 16, fontWeight: "700", marginBottom: 6 },
  previewMeta: { color: "#4B5563", fontSize: 13, marginBottom: 4 },
  replayButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#6D5AAE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  replayButtonText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  emptyText: { color: "#6B7280", fontSize: 13, lineHeight: 20 },
  readyFooter: { marginTop: 4, alignItems: "center" },
  readyText: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
    color: "#333",
    paddingHorizontal: 10,
  },
  startBtn: {
    backgroundColor: "#7D849A",
    width: "100%",
    padding: 20,
    borderRadius: 25,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  startBtnDisabled: {
    opacity: 0.7,
  },
  startBtnText: { color: "white", fontSize: 18, fontWeight: "bold" },
  errorText: {
    marginTop: 10,
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "600",
  },
});
