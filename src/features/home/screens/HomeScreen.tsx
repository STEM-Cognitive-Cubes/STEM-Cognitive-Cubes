import React, { useRef, useState, useEffect } from "react";
import { Animated, Pressable, Text, StyleSheet, View, Image } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../services/firebase";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import HistoryCardSvg from "@/assets/cards/historyCard.svg";
import InsightsCardSvg from "@/assets/cards/insightsCard.svg";
import { ScrollView } from "react-native";
import BotBubbleFab from "@/components/BotBubbleFab";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/types";

const getDisplayFirstName = () => {
  const displayName = auth.currentUser?.displayName?.trim();
  if (displayName) {
    return displayName.split(/\s+/)[0];
  }
  const email = auth.currentUser?.email?.trim();
  if (email) {
    return email.split("@")[0];
  }
  return "User";
};

export default function HomeScreen() {
  const fabOpacity = useRef(new Animated.Value(1)).current;
  const fabTranslateY = useRef(new Animated.Value(0)).current;

  // Standardized navigation hook for Native Stack
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  const [parentName, setParentName] = useState(getDisplayFirstName());

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setParentName(getDisplayFirstName());
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "parents", uid),
      (parentDoc) => {
        if (!parentDoc.exists()) {
          setParentName(getDisplayFirstName());
          return;
        }

        const data = parentDoc.data();
        console.log("HomeScreen Parent Data:", data);
        const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
        const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
        if (firstName) {
          setParentName(firstName);
          return;
        }
        if (fullName) {
          setParentName(fullName.split(/\s+/)[0]);
          return;
        }
        setParentName(getDisplayFirstName());
      },
      (error) => {
        console.error("HomeScreen onSnapshot error:", error);
        setParentName(getDisplayFirstName());
      }
    );

    return () => unsubscribe();
  }, []);

  const hideFab = () => {
    if (isHidden.current) return;
    isHidden.current = true;

    Animated.parallel([
      Animated.timing(fabOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(fabTranslateY, {
        toValue: 26,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const showFab = () => {
    if (!isHidden.current) return;
    isHidden.current = false;

    Animated.parallel([
      Animated.timing(fabOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(fabTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const prevY = lastScrollY.current;

    const goingDown = y > prevY;
    const goingUp = y < prevY;

    const hideAfter = 40;
    const showNearTop = 20;

    if (y <= showNearTop) {
      showFab();
    } else if (goingDown && y > hideAfter) {
      hideFab();
    } else if (goingUp) {
      showFab();
    }

    lastScrollY.current = y;
  };

  return (
    <SafeAreaProvider style={styles.safe}>
      <View style={styles.root}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >

          {/*Hero Section with Gradient */}
          <LinearGradient
            colors={["#cf92fe", "#A24BFF", "#B860FF"]}
            style={styles.hero}
          >
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.helloText}>
                  Hello, <Text style={styles.nameText}>{parentName}!</Text>
                </Text>
                <Text style={styles.welcomeText}>Ready to track creativity?</Text>
              </View>

              <View style={styles.bellButton}>
                <Text style={{ fontSize: 16 }}>🔔</Text>
                <View style={styles.notificationDot} />
              </View>
            </View>

            <View style={styles.heroContentRow}>
              {/* Mascot Asset */}
              <View style={styles.mascotContainer}>
                <Image
                  source={require("../../../assets/mascot/Home_Mascot.png")}
                  style={styles.mascotImg}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.sparkles}>
                <Text style={styles.sparkleBig}>✦</Text>
                <Text style={styles.sparkleMid}>✧</Text>
                <Text style={styles.sparkleSmall}>✦</Text>
              </View>

              {/* AI Insight Bubble */}
              <View style={styles.bubbleWrapper}>
                <View style={styles.bubbleGlow} />
                <View style={styles.bubble}>
                  <Text style={[styles.bubbleText, styles.bubbleHeadline]}>
                    Your child enjoys complex builds.
                  </Text>
                  <Text style={[styles.bubbleText, styles.bubbleBody]}>
                    Encourage this with drawing play.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.waveContainer}>
              <Svg width="100%" height={110} viewBox="0 0 375 110" preserveAspectRatio="none">
                <Path
                  d="M0,50 C70,90 140,10 200,45 C260,80 320,30 375,50"
                  fill="none"
                  stroke="rgba(255,255,255,0.22)"
                  strokeWidth={18}
                  strokeLinecap="round"
                />
                <Path
                  d="M0,50 C70,90 140,10 200,45 C260,80 320,30 375,50"
                  fill="none"
                  stroke="rgba(255,255,255,0.30)"
                  strokeWidth={10}
                  strokeLinecap="round"
                />
                <Path
                  d="M0,50 C70,90 140,10 200,45 C260,80 320,30 375,50"
                  fill="none"
                  stroke="rgba(255,255,255,0.55)"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
                <Path
                  d="M0,50 C70,90 140,10 200,45 C260,80 320,30 375,50 L375,110 L0,110 Z"
                  fill="#FFFFFF"
                />
              </Svg>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickRow}>
            {/* History Card with SVG */}
            <Pressable style={styles.svgCardWrap} onPress={() => navigation.navigate('History')}>
              <HistoryCardSvg width="100%" height="100%" />
              <View style={styles.cardOverlay}>
                <Image
                  source={require("../../../assets/icons/history.png")}
                  style={styles.overlayIcon}
                  resizeMode="contain"
                />
                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>History</Text>
                  <Text style={styles.cardSubtitle}>View past builds</Text>
                </View>
              </View>
            </Pressable>

            {/* Insights Card with SVG */}
            <Pressable style={styles.svgCardWrap} onPress={() => navigation.navigate('Insights')}>
              <InsightsCardSvg width="100%" height="100%" />
              <View style={styles.cardOverlay}>
                <Image
                  source={require("../../../assets/icons/insights.png")}
                  style={styles.overlayIconLarge}
                  resizeMode="contain"
                />
                <View style={styles.cardTextBlock}>
                  <Text style={styles.cardTitle}>Insights</Text>
                  <Text style={styles.cardSubtitle}>New suggestions</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Start Session Integrated Card */}
          <View style={styles.sessionCard}>
            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Hive active</Text>
            </View>

            <Text style={styles.sessionTitle}>Start a session</Text>
            <Text style={styles.sessionDesc}>
              Connects blocks to generate real-time 3D models and insights
            </Text>

            {/* Navigates to your StartSession screen */}
            <Pressable
              style={styles.sessionBtn}
              onPress={() => navigation.navigate('StartSession')}
            >
              <Text style={styles.sessionBtnText}>Track Now</Text>
            </Pressable>

            <Image
              source={require("../../../assets/mascot/session_mascot.png")}
              style={styles.sessionMascot}
              resizeMode="contain"
            />
          </View>
        </ScrollView>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.fabHost,
            { opacity: fabOpacity, transform: [{ translateY: fabTranslateY }] },
          ]}
        >
          <BotBubbleFab
            size={66}
            onPress={() => console.log("Bot tapped")}
          />
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  root: { flex: 1 },
  scrollContent: { paddingBottom: 110 },
  hero: { height: 420, paddingHorizontal: 18, paddingTop: 66 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  helloText: { fontSize: 34, fontWeight: "700", color: "#FFE572" },
  nameText: { fontWeight: "900", color: "#ffffff" },
  welcomeText: { marginTop: 4, fontSize: 14, color: "rgba(255, 255, 255, 0.81)", fontWeight: "800" },
  bellButton: { width: 42, height: 42, backgroundColor: "#fff", borderRadius: 12, alignItems: "center", justifyContent: "center", position: "relative" },
  notificationDot: { width: 8, height: 8, borderRadius: 99, backgroundColor: "#FF2D55", position: "absolute", right: 8, top: 8 },
  content: { backgroundColor: "#fff", paddingHorizontal: 18, paddingTop: 16 },
  quickActionsTitle: { fontSize: 25, fontWeight: "900", color: "#5064AC", marginTop: -30, marginBottom: 10, zIndex: 5 },
  mascotImg: { width: 340, height: 340, marginTop: 60, marginLeft: -99 },
  heroContentRow: { flexDirection: "row", alignItems: "center", marginTop: 22, zIndex: 2 },
  mascotContainer: { width: 110, height: 110, justifyContent: "center", alignItems: "flex-start", overflow: "visible" },
  bubbleWrapper: { flex: 1, alignItems: "flex-end", marginTop: 22, marginLeft: 10 },
  bubble: { backgroundColor: "#FFFFFF", borderRadius: 22, paddingVertical: 18, paddingHorizontal: 18, maxWidth: "92%", shadowColor: "#000", shadowOpacity: 0.18, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 7 },
  bubbleText: { fontSize: 15, lineHeight: 20, color: "#5064AC", textAlign: "center", fontWeight: "700" },
  bubbleHeadline: { fontWeight: "900", fontSize: 18 },
  bubbleBody: { marginTop: 10 },
  bubbleGlow: { position: "absolute", top: -6, bottom: -6, left: 15, right: -5, borderRadius: 28, backgroundColor: "rgba(255,255,255,0.35)", shadowColor: "#FFFFFF", shadowOpacity: 0.9, shadowRadius: 22, shadowOffset: { width: 0, height: 0 }, elevation: 10 },
  waveContainer: { position: "absolute", left: 0, right: 0, bottom: -14, zIndex: 1 },
  sparkles: { position: "absolute", left: 28, bottom: 118, zIndex: 3 },
  sparkleBig: { fontSize: 18, color: "rgba(255,255,255,0.95)", textShadowColor: "rgba(255,255,255,0.7)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  sparkleMid: { position: "absolute", left: 18, top: 12, fontSize: 12, color: "rgba(255,255,255,0.85)", textShadowColor: "rgba(255,255,255,0.6)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  sparkleSmall: { position: "absolute", left: 40, top: 2, fontSize: 10, color: "rgba(255,255,255,0.75)", textShadowColor: "rgba(255,255,255,0.5)", textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6 },
  quickRow: { flexDirection: "row", gap: 25, marginTop: 2, marginBottom: 24, marginLeft: 20, marginRight: 20 },
  cardTitle: { fontSize: 25, fontWeight: "900", color: "#FFFFFF" },
  cardSubtitle: { marginTop: 2, fontSize: 16, fontWeight: "700", color: "rgba(255,255,255,0.85)" },
  svgCardWrap: { flex: 1, height: 140 },
  cardOverlay: { position: "absolute", inset: 0, padding: 20, justifyContent: "space-between" },
  overlayIcon: { width: 64, height: 64, opacity: 0.95, position: "absolute", top: 8, left: 16 },
  overlayIconLarge: { width: 102, height: 102, opacity: 0.95, position: "absolute", top: -14, left: 14 },
  cardTextBlock: { marginTop: "auto" },
  sessionCard: { marginTop: -16, marginHorizontal: 20, borderRadius: 22, backgroundColor: "#7E89B8", padding: 24, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  statusPill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  statusDot: { width: 12, height: 12, borderRadius: 99, backgroundColor: "#35E06F" },
  statusText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  sessionTitle: { marginTop: 12, color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  sessionDesc: { marginTop: 6, color: "rgba(255,255,255,0.9)", fontSize: 17, fontWeight: "600", maxWidth: "78%" },
  sessionBtn: { marginTop: 14, alignSelf: "flex-start", backgroundColor: "#FFFFFF", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 },
  sessionBtnText: { color: "#5064AC", fontWeight: "900", fontSize: 20 },
  sessionMascot: { position: "absolute", right: -90, bottom: -60, width: 300, height: 300, opacity: 0.95 },
  fabHost: { position: "absolute", right: 18, bottom: -30, zIndex: 999 },
});
