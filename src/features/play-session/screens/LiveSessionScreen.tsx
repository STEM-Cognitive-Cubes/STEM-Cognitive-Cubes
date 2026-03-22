import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/services/firebase";
import type { RootStackParamList } from "@/navigation/types";
import {
  buildPlaybackSnapshot,
  DEMO_PLAYBACK_TEMPLATE,
  finalizeSession,
  loadPlaybackArtifact,
  playbackEventToContractEvent,
  type PlaybackEvent,
} from "@/services/sessionPlayback";

type LiveSessionRoute = RouteProp<RootStackParamList, "LiveSession">;

function formatTime(totalMs: number) {
  const totalSeconds = Math.max(0, Math.floor(totalMs / 1000));
  const mins = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (totalSeconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function LiveSessionScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<LiveSessionRoute>();

  const mode = route.params?.mode ?? "live";
  const sessionId = route.params?.sessionId;
  const routePlaybackJsonPath = route.params?.playbackJsonPath;
  const routePlaybackJsonUrl = route.params?.playbackJsonUrl;

  const [playheadMs, setPlayheadMs] = useState(0);
  const [isActive, setIsActive] = useState(mode === "live");
  const [templateIndex, setTemplateIndex] = useState(0);
  const [events, setEvents] = useState<PlaybackEvent[]>([]);
  const [isLoadingReplay, setIsLoadingReplay] = useState(mode === "replay");
  const [replayError, setReplayError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const timer = setInterval(() => {
      setPlayheadMs((prev) => prev + 250);
    }, 250);

    return () => clearInterval(timer);
  }, [isActive]);

  useEffect(() => {
    if (mode !== "replay") {
      return;
    }

    let isCancelled = false;

    const loadReplay = async () => {
      setIsLoadingReplay(true);
      setReplayError(null);

      try {
        let playbackPath = routePlaybackJsonPath;
        let playbackUrl = routePlaybackJsonUrl;
        if (sessionId && (!playbackPath || !playbackUrl)) {
          const sessionSnapshot = await getDoc(doc(db, "playSessions", sessionId));
          const sessionData = sessionSnapshot.data() || {};
          if (!playbackPath && typeof sessionData.playbackJsonPath === "string") {
            playbackPath = sessionData.playbackJsonPath;
          }
          if (!playbackUrl && typeof sessionData.playbackJsonUrl === "string") {
            playbackUrl = sessionData.playbackJsonUrl;
          }
        }

        if (!playbackPath && !playbackUrl) {
          throw new Error("This session does not have a playback JSON file.");
        }

        const artifact = await loadPlaybackArtifact({
          playbackJsonPath: playbackPath,
          playbackJsonUrl: playbackUrl,
        });
        if (isCancelled) {
          return;
        }

        setEvents(artifact.events);
        setPlayheadMs(0);
        setIsActive(false);
      } catch (error) {
        console.error("Failed to load replay artifact", error);
        if (!isCancelled) {
          setReplayError("Could not load the playback JSON for this session.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingReplay(false);
        }
      }
    };

    loadReplay();

    return () => {
      isCancelled = true;
    };
  }, [mode, routePlaybackJsonPath, routePlaybackJsonUrl, sessionId]);

  const snapshot = useMemo(
    () => buildPlaybackSnapshot(events, playheadMs),
    [events, playheadMs]
  );

  useEffect(() => {
    if (mode !== "replay") {
      return;
    }

    if (snapshot.maxT > 0 && playheadMs >= snapshot.maxT) {
      setIsActive(false);
    }
  }, [mode, playheadMs, snapshot.maxT]);

  const handleReset = () => {
    setIsActive(false);
    setPlayheadMs(0);
    if (mode === "live") {
      setEvents([]);
      setTemplateIndex(0);
    }
  };

  const handleAddNextStep = () => {
    if (mode === "replay") {
      const nextEvent = events[snapshot.appliedEvents];
      if (!nextEvent) {
        return;
      }
      setPlayheadMs(nextEvent.t);
      return;
    }

    const template = DEMO_PLAYBACK_TEMPLATE[templateIndex % DEMO_PLAYBACK_TEMPLATE.length];
    const lastEventTs = events.length ? events[events.length - 1].t : 0;
    const nextTs = Math.max(lastEventTs + 300, Math.max(playheadMs, 0));

    const nextEvent: PlaybackEvent = {
      ...template,
      t: nextTs,
    };

    setEvents((prev) => [...prev, nextEvent]);
    setTemplateIndex((prev) => prev + 1);
    setPlayheadMs(nextTs);
  };

  const handleEndSession = async () => {
    if (mode === "replay") {
      navigation.goBack();
      return;
    }

    if (!sessionId) {
      Alert.alert("Session Error", "Session ID is missing. Start a new session again.");
      return;
    }

    setIsFinalizing(true);
    setIsActive(false);

    try {
      const payloadEvents = events.map((event) =>
        playbackEventToContractEvent(event, sessionId)
      );

      await finalizeSession({
        sessionId,
        durationSeconds: Math.max(0, Math.floor(playheadMs / 1000)),
        events: payloadEvents,
      });

      Alert.alert("Session Saved", "Playback JSON is ready for replay.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("StartSession"),
        },
      ]);
    } catch (error) {
      console.error("Failed to finalize session", error);
      Alert.alert(
        "Finalize Failed",
        "Could not finalize this session. Please retry with internet access."
      );
    } finally {
      setIsFinalizing(false);
    }
  };

  const headerTitle = mode === "replay" ? "Session Replay" : "Live Session";
  const endButtonLabel = mode === "replay" ? "Close replay" : "End session";
  const stepLabel =
    mode === "replay"
      ? `Next Event (${snapshot.appliedEvents}/${events.length})`
      : `Next Building Step (${snapshot.appliedEvents}/${Math.max(events.length, 1)})`;

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.topSection}>
        <View style={styles.liveHeader}>
          <View style={styles.liveIndicator}>
            <View style={[styles.redDot, mode === "replay" && styles.replayDot]} />
            <Text style={styles.liveText}>{headerTitle}</Text>
          </View>
          <TouchableOpacity
            disabled={isFinalizing}
            onPress={handleEndSession}
            style={styles.endBtn}
          >
            {isFinalizing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.endBtnText}>{endButtonLabel}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(playheadMs)}</Text>
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setIsActive((prev) => !prev)}
              disabled={isFinalizing || isLoadingReplay}
            >
              <Ionicons name={isActive ? "pause" : "play"} size={28} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={handleReset}
              disabled={isFinalizing || isLoadingReplay}
            >
              <Ionicons name="refresh" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.viewportCard}>
        <Text style={styles.viewportTitle}>3D Structure View</Text>
        <View style={styles.blackScreen}>
          <View style={styles.buildArea}>
            <View style={styles.gridFloor} />

            {isLoadingReplay ? (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.loadingOverlayText}>Loading playback JSON...</Text>
              </View>
            ) : replayError ? (
              <View style={styles.loadingOverlay}>
                <Text style={styles.errorOverlayText}>{replayError}</Text>
              </View>
            ) : snapshot.blocks.length === 0 ? (
              <View style={styles.loadingOverlay}>
                <Text style={styles.loadingOverlayText}>
                  {mode === "live"
                    ? "Tap Next Building Step to generate edge events."
                    : "No blocks available for this replay step."}
                </Text>
              </View>
            ) : (
              snapshot.blocks.map((block) => {
                const isoX = block.x * 34 + block.z * 14;
                const isoY = block.y * 28 + block.z * 8;

                return (
                  <View
                    key={block.id}
                    style={[
                      styles.block,
                      {
                        backgroundColor: block.color,
                        left: "50%",
                        bottom: 36,
                        marginLeft: -18 + isoX,
                        transform: [{ translateY: -isoY }],
                        zIndex: 100 + block.y * 5 + block.z,
                      },
                    ]}
                  >
                    <Text style={styles.blockText}>{block.id.replace("Cube_", "")}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.stepBtn}
          onPress={handleAddNextStep}
          disabled={isFinalizing || isLoadingReplay}
        >
          <Text style={styles.stepBtnText}>{stepLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FB" },
  topSection: {
    backgroundColor: "#6D5AAE",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  liveHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  liveIndicator: { flexDirection: "row", alignItems: "center" },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF5C5C", marginRight: 8 },
  replayDot: { backgroundColor: "#38BDF8" },
  liveText: { color: "white", fontWeight: "bold", fontSize: 18 },
  endBtn: {
    minWidth: 110,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  endBtnText: { color: "white", fontWeight: "600" },
  timerContainer: { alignItems: "center", marginTop: 20 },
  timerText: { fontSize: 54, fontWeight: "bold", color: "white" },
  controlRow: { flexDirection: "row", marginTop: 25 },
  controlBtn: { alignItems: "center", marginHorizontal: 25 },
  viewportCard: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 30,
    padding: 20,
    elevation: 5,
  },
  viewportTitle: { fontSize: 18, fontWeight: "bold", color: "#4A4A8E", marginBottom: 15 },
  blackScreen: { height: 240, backgroundColor: "#0A0A10", borderRadius: 25, overflow: "hidden" },
  buildArea: { flex: 1, position: "relative" },
  gridFloor: {
    position: "absolute",
    bottom: 24,
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingOverlayText: { marginTop: 10, color: "rgba(255,255,255,0.75)", textAlign: "center" },
  errorOverlayText: { color: "#FCA5A5", textAlign: "center" },
  block: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  blockText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
  stepBtn: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
  },
  stepBtnText: { color: "#6D5AAE", fontWeight: "bold" },
});
