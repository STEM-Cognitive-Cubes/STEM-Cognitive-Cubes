import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  finalizeSession,
  getLatestEndedSessionPreview,
  type LatestEndedSessionPreview,
} from "@/services/sessionPlayback";

const MANUAL_TEST_EVENTS: Array<Record<string, unknown>> = [
  { t: 0, type: "connect", cubeA: "A", faceA: 2, cubeB: "B", faceB: 5 },
  { t: 200, type: "connect", cubeA: "A", faceA: 3, cubeB: "C", faceB: 4 },
  { t: 400, type: "connect", cubeA: "B", faceA: 3, cubeB: "D", faceB: 4 },
  { t: 600, type: "connect", cubeA: "C", faceA: 2, cubeB: "E", faceB: 5 },
  { t: 800, type: "connect", cubeA: "D", faceA: 1, cubeB: "F", faceB: 6 },
  { t: 1000, type: "connect", cubeA: "E", faceA: 1, cubeB: "G", faceB: 6 },
  { t: 1200, type: "connect", cubeA: "F", faceA: 3, cubeB: "H", faceB: 4 },
  { t: 1400, type: "connect", cubeA: "G", faceA: 3, cubeB: "I", faceB: 4 },
  { t: 1600, type: "connect", cubeA: "H", faceA: 2, cubeB: "J", faceB: 5 },
  { t: 1800, type: "connect", cubeA: "I", faceA: 5, cubeB: "K", faceB: 2 },
  { t: 2000, type: "connect", cubeA: "J", faceA: 1, cubeB: "L", faceB: 6 },
  { t: 2200, type: "connect", cubeA: "K", faceA: 1, cubeB: "M", faceB: 6 },
  { t: 2400, type: "connect", cubeA: "L", faceA: 3, cubeB: "N", faceB: 4 },
  { t: 2600, type: "connect", cubeA: "M", faceA: 3, cubeB: "O", faceB: 4 },
  { t: 2800, type: "connect", cubeA: "N", faceA: 2, cubeB: "P", faceB: 5 },
  { t: 3000, type: "connect", cubeA: "O", faceA: 2, cubeB: "Q", faceB: 5 },
  { t: 3200, type: "disconnect", cubeA: "C", faceA: 3, cubeB: "E", faceB: 4 },
  { t: 3400, type: "disconnect", cubeA: "D", faceA: 1, cubeB: "F", faceB: 6 },
  { t: 3600, type: "connect", cubeA: "F", faceA: 2, cubeB: "R", faceB: 5 },
  { t: 3800, type: "connect", cubeA: "E", faceA: 2, cubeB: "S", faceB: 5 },
  { t: 4000, type: "connect", cubeA: "A", faceA: 1, cubeB: "T", faceB: 6 },
  { t: 4200, type: "connect", cubeA: "T", faceA: 3, cubeB: "U", faceB: 4 },
  { t: 4400, type: "connect", cubeA: "U", faceA: 3, cubeB: "V", faceB: 4 },
  { t: 4600, type: "connect", cubeA: "V", faceA: 2, cubeB: "W", faceB: 5 },
  { t: 4800, type: "connect", cubeA: "W", faceA: 1, cubeB: "X", faceB: 6 },
  { t: 5000, type: "connect", cubeA: "X", faceA: 3, cubeB: "Y", faceB: 4 },
  { t: 5200, type: "connect", cubeA: "Y", faceA: 2, cubeB: "Z", faceB: 5 },
  { t: 5400, type: "disconnect", cubeA: "A", faceA: 2, cubeB: "B", faceB: 5 },
  { t: 5600, type: "connect", cubeA: "B", faceA: 6, cubeB: "AA", faceB: 1 },
  { t: 5800, type: "connect", cubeA: "C", faceA: 6, cubeB: "AB", faceB: 1 },
  { t: 6000, type: "disconnect", cubeA: "J", faceA: 1, cubeB: "L", faceB: 6 },
  { t: 6200, type: "connect", cubeA: "K", faceA: 3, cubeB: "AC", faceB: 4 },
  { t: 6400, type: "connect", cubeA: "AC", faceA: 3, cubeB: "AD", faceB: 4 },
  { t: 6600, type: "connect", cubeA: "AD", faceA: 3, cubeB: "AE", faceB: 4 },
  { t: 6800, type: "connect", cubeA: "AE", faceA: 3, cubeB: "AF", faceB: 4 },
  { t: 7000, type: "connect", cubeA: "AF", faceA: 2, cubeB: "AG", faceB: 5 },
  { t: 7200, type: "disconnect", cubeA: "AF", faceA: 2, cubeB: "AG", faceB: 5 },
  { t: 7400, type: "disconnect", cubeA: "AE", faceA: 3, cubeB: "AF", faceB: 4 },
  { t: 7600, type: "connect", cubeA: "AE", faceA: 5, cubeB: "AH", faceB: 2 },
  { t: 7800, type: "connect", cubeA: "AH", faceA: 1, cubeB: "AI", faceB: 6 },
  { t: 8000, type: "connect", cubeA: "AI", faceA: 2, cubeB: "AJ", faceB: 5 },
  { t: 8200, type: "connect", cubeA: "AJ", faceA: 3, cubeB: "AK", faceB: 4 },
  { t: 8400, type: "connect", cubeA: "AK", faceA: 1, cubeB: "AL", faceB: 6 },
  { t: 8600, type: "connect", cubeA: "AL", faceA: 3, cubeB: "AM", faceB: 4 },
  { t: 8800, type: "disconnect", cubeA: "AL", faceA: 3, cubeB: "AM", faceB: 4 },
  { t: 9000, type: "disconnect", cubeA: "AJ", faceA: 3, cubeB: "AK", faceB: 4 },
  { t: 9200, type: "connect", cubeA: "V", faceA: 6, cubeB: "AN", faceB: 1 },
  { t: 9400, type: "connect", cubeA: "AN", faceA: 2, cubeB: "AO", faceB: 5 },
  { t: 9600, type: "connect", cubeA: "AO", faceA: 3, cubeB: "AP", faceB: 4 },
  { t: 9800, type: "connect", cubeA: "AP", faceA: 6, cubeB: "AQ", faceB: 1 },
  { t: 10000, type: "disconnect", cubeA: "AP", faceA: 6, cubeB: "AQ", faceB: 1 },
  { t: 10200, type: "disconnect", cubeA: "AN", faceA: 2, cubeB: "AO", faceB: 5 },
  { t: 10400, type: "disconnect", cubeA: "V", faceA: 6, cubeB: "AN", faceB: 1 },
];

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
  const [isRunningManualTest, setIsRunningManualTest] = useState(false);
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
      playbackJsonUrl: latestEndedSession.playbackJsonUrl,
    });
  };

  const handleRunManualJsonTest = async () => {
    if (isRunningManualTest) {
      return;
    }

    setStartError(null);
    setIsRunningManualTest(true);
    try {
      const sessionId = `manual-test-${Date.now()}`;
      const durationSeconds = Math.ceil(
        Math.max(
          0,
          ...MANUAL_TEST_EVENTS.map((event) => {
            const t = event.t;
            return typeof t === "number" && Number.isFinite(t) ? t : 0;
          })
        ) / 1000
      );

      const result = await finalizeSession({
        sessionId,
        durationSeconds,
        events: MANUAL_TEST_EVENTS,
      });

      await loadLatestEndedSession();

      Alert.alert(
        "Manual JSON Session Ready",
        `Session ${result.sessionId} created with ${result.eventCount} events.`,
        [
          {
            text: "Replay now",
            onPress: () =>
              navigation.navigate("LiveSession", {
                mode: "replay",
                sessionId: result.sessionId,
                playbackJsonPath: result.playbackJsonPath,
                playbackJsonUrl: result.playbackJsonUrl,
              }),
          },
          { text: "OK" },
        ]
      );
    } catch (error) {
      console.error("Manual JSON test failed", error);
      Alert.alert(
        "Manual JSON Failed",
        "Could not trigger manual JSON finalize. Check internet and login."
      );
    } finally {
      setIsRunningManualTest(false);
    }
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

            <TouchableOpacity
              style={[styles.manualTestButton, isRunningManualTest && styles.startBtnDisabled]}
              onPress={handleRunManualJsonTest}
              disabled={isRunningManualTest}
            >
              {isRunningManualTest ? (
                <ActivityIndicator size="small" color="#6D5AAE" />
              ) : (
                <Text style={styles.manualTestButtonText}>TEMP: Run Manual JSON Test</Text>
              )}
            </TouchableOpacity>
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
  manualTestButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    backgroundColor: "#EEEAFE",
    borderWidth: 1,
    borderColor: "#6D5AAE",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 220,
    alignItems: "center",
  },
  manualTestButtonText: { color: "#6D5AAE", fontSize: 13, fontWeight: "700" },
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
