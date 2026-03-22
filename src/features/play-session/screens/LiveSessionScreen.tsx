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
  finalizeSession,
  loadPlaybackArtifact,
  playbackEventToContractEvent,
  type PlaybackEvent,
} from "@/services/sessionPlayback";

type LiveSessionRoute = RouteProp<RootStackParamList, "LiveSession">;
type PlaybackThreeCanvasProps = {
  events: PlaybackEvent[];
  playheadMs: number;
};

let PlaybackThreeCanvas:
  | React.ComponentType<PlaybackThreeCanvasProps>
  | null = null;
let playbackThreeLoadError = "";
try {
  PlaybackThreeCanvas = require("../components/PlaybackThreeCanvas").default as React.ComponentType<PlaybackThreeCanvasProps>;
} catch (error) {
  playbackThreeLoadError =
    error instanceof Error ? error.message : "3D viewer could not load.";
}

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
  const [events, setEvents] = useState<PlaybackEvent[]>([]);
  const [isLoadingReplay, setIsLoadingReplay] = useState(mode === "replay");
  const [replayError, setReplayError] = useState<string | null>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let frameId = 0;
    let lastTs: number | null = null;

    const tick = (ts: number) => {
      if (lastTs === null) {
        lastTs = ts;
      }
      const deltaMs = Math.max(0, ts - lastTs);
      lastTs = ts;

      setPlayheadMs((prev) => prev + deltaMs);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
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
        setIsActive(true);
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
    setIsActive(mode === "replay");
    setPlayheadMs(0);
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
  const ThreeCanvasComponent = PlaybackThreeCanvas;
  const canRenderThree = Boolean(ThreeCanvasComponent);
  const progressRatio = snapshot.maxT > 0 ? Math.min(1, playheadMs / snapshot.maxT) : 0;
  const progressPercent = Math.round(progressRatio * 100);
  const progressLabel =
    mode === "replay"
      ? `Replay Progress ${progressPercent}%`
      : `Session Progress ${progressPercent}%`;
  const progressSubLabel = `Events ${snapshot.appliedEvents}/${events.length}`;

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
          {!isLoadingReplay && !replayError && ThreeCanvasComponent ? (
            <ThreeCanvasComponent events={events} playheadMs={playheadMs} />
          ) : null}

          {isLoadingReplay ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingOverlayText}>Loading playback JSON...</Text>
            </View>
          ) : replayError ? (
            <View style={styles.loadingOverlay}>
              <Text style={styles.errorOverlayText}>{replayError}</Text>
            </View>
          ) : !canRenderThree ? (
            <View style={styles.loadingOverlay}>
              <Text style={styles.errorOverlayText}>
                3D module unavailable (ExpoGL missing). Rebuild app with:
              </Text>
              <Text style={styles.warningOverlayText}>
                npx expo run:android
              </Text>
              <Text style={styles.warningOverlayText}>
                npx expo start --dev-client
              </Text>
              {__DEV__ && playbackThreeLoadError ? (
                <Text style={styles.loadingOverlayText}>{playbackThreeLoadError}</Text>
              ) : null}
            </View>
          ) : snapshot.blocks.length === 0 ? (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingOverlayText}>
                {mode === "live"
                  ? "Tap Next Building Step to generate edge events."
                  : "No blocks available for this replay step."}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressLabel}>{progressLabel}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSubLabel}>{progressSubLabel}</Text>
        </View>
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingOverlayText: { marginTop: 10, color: "rgba(255,255,255,0.75)", textAlign: "center" },
  errorOverlayText: { color: "#FCA5A5", textAlign: "center" },
  warningOverlayText: {
    marginTop: 6,
    color: "#E2E8F0",
    textAlign: "center",
    fontWeight: "600",
  },
  progressCard: {
    backgroundColor: "#F2F2F2",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  progressLabel: { color: "#6D5AAE", fontWeight: "800", textAlign: "center", marginBottom: 8 },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E2DDF5",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6D5AAE",
    borderRadius: 999,
  },
  progressSubLabel: {
    marginTop: 8,
    color: "#6D5AAE",
    textAlign: "center",
    fontWeight: "700",
  },
});
