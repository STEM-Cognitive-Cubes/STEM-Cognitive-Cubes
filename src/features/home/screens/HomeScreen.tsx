import React from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';  
import Svg, { Path } from 'react-native-svg';

export default function HomeScreen() {
  return (
    <SafeAreaProvider style={styles.safe}>
      <View style={styles.root}>
        {/*Hero*/}
        <LinearGradient
            colors={["#cf92fe", "#A24BFF", "#B860FF"]}
            style={styles.hero}
          >
            <View style={styles.headerRow}>
                <View style={{flex: 1}}>
                    <Text style={styles.helloText}>
                        Hello, <Text style={styles.nameText}>User!</Text>
                    </Text>
                    <Text style={styles.welcomeText}>Ready to track creativity?</Text>
                </View>

                <View style={styles.bellButton}>
                    <Text style={{fontSize: 16}}>🔔</Text>
                    <View style={styles.notificationDot} />
                </View>

            </View>
            
            <View style={styles.heroContentRow}>
                {/* Mascot */}
                <View style={styles.mascotContainer}>
                    <Image
                    source={require("../../../assets/mascot/Home_Mascot.png")}
                    style={styles.mascotImg}
                    resizeMode="contain"
                    />
                </View>

                {/* Sparkles near the curve */}
            <View style={styles.sparkles}>
                <Text style={styles.sparkleBig}>✦</Text>
                <Text style={styles.sparkleMid}>✧</Text>
                <Text style={styles.sparkleSmall}>✦</Text>
            </View>

                {/* Bubble */}
                <View style={styles.bubbleWrapper}>
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
                    {/* GLOW (drawn first so fill sits clean) */}
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
                    
                    {/* WAVE FILL (the actual white section) */}
                    <Path
                    d="M0,50 C70,90 140,10 200,45 C260,80 320,30 375,50 L375,110 L0,110 Z"
                    fill="#FFFFFF"
                    />
                </Svg>
            </View>


        </LinearGradient>

        {/*Content*/}
        <View style={styles.content}>
          <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        </View>
        
    </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    safe: {flex: 1, backgroundColor: "#fff"},
    root: { flex: 1 },

    hero: {
    height: 420,
    paddingHorizontal: 18,
    paddingTop: 66,
  },

  headerRow: {
  flexDirection: "row",
  alignItems: "flex-start",
  gap: 12,
},

  helloText: { fontSize: 34, fontWeight: "700", color: "#FFE572" },
  nameText: { fontWeight: "900", color: "#ffffff" },

  welcomeText: {
  marginTop: 4,
  fontSize: 14,
  color: "rgba(255, 255, 255, 0.81)",
  fontWeight: "800",
 },

    bellButton: {
    width: 42,
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    },


    notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#FF2D55",
    position: "absolute",
    right: 8,
    top: 8,
    },

  content: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 16,
  },

  quickActionsTitle: {
  fontSize: 25,
  fontWeight: "900",
  color: "#5064AC", // matches your yellow card vibe
  marginTop: 2,
  marginBottom: 20,
},


  tempBodyText: { fontWeight: "800" },

  mascotImg: {
  width: 340,
  height: 340,
  marginTop: 60,
  marginLeft: -99,
},


heroContentRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 22,
  zIndex: 2,
},


mascotContainer: {
  width: 110,
  height: 110,
  justifyContent: "center",
  alignItems: "flex-start",
  overflow: "visible",
},

bubbleWrapper: {
  flex: 1,
  alignItems: "flex-end",
  marginTop: 22,
  marginLeft: 10,
},

bubble: {
  backgroundColor: "#FFFFFF",
  borderRadius: 22,      // rounder = friendlier
  paddingVertical: 18,
  paddingHorizontal: 18,
  maxWidth: "92%",       // less wide = more focused
  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 10 },
  elevation: 7,
},


bubbleText: {
  fontSize: 15,          // bigger
  lineHeight: 20,
  color: "#5F5F5F",
  textAlign: "center",
  fontWeight: "700",     // stronger
},

bubbleHeadline: {
  fontWeight: "900",
  fontSize: 18,
},

bubbleBody: {
  marginTop: 10,
},

waveContainer: {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: -14,   // tweak to match your hero height
  zIndex: 1,
},


sparkles: {
  position: "absolute",
  left: 28,      // move sparkle cluster left/right
  bottom: 118,    // move sparkle cluster up/down (near wave)
  zIndex: 3,     // above wave
},

sparkleBig: {
  fontSize: 18,
  color: "rgba(255,255,255,0.95)",
  textShadowColor: "rgba(255,255,255,0.7)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 10,
},

sparkleMid: {
  position: "absolute",
  left: 18,
  top: 12,
  fontSize: 12,
  color: "rgba(255,255,255,0.85)",
  textShadowColor: "rgba(255,255,255,0.6)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 8,
},

sparkleSmall: {
  position: "absolute",
  left: 40,
  top: 2,
  fontSize: 10,
  color: "rgba(255,255,255,0.75)",
  textShadowColor: "rgba(255,255,255,0.5)",
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 6,
},


});