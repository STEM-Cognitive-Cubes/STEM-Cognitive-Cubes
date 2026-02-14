import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BotIntroScreen1({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#cf92fe", "#A24BFF", "#B860FF"]} style={styles.container}>
        
        {/* Glowing Orb */}
        <View style={styles.orbWrap}>
          <View style={styles.glow} />
          <View style={styles.orb}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </View>

        <Text style={styles.title}>Meet Your BlokC Assistant ✨</Text>
        <Text style={styles.desc}>
          I help you understand sessions, insights, and everything about your child’s creativity journey.
        </Text>

        <Pressable
          style={styles.btn}
          onPress={() => navigation.navigate("BotIntro2")}
        >
          <Text style={styles.btnText}>Next</Text>
        </Pressable>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },

  orbWrap: { marginBottom: 40, alignItems: "center", justifyContent: "center" },
  glow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.25)",
    shadowColor: "#fff",
    shadowOpacity: 0.9,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  orb: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 14,
  },
  eye: {
    width: 10,
    height: 22,
    borderRadius: 8,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFE572",
    textAlign: "center",
  },
  desc: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },

  btn: {
    marginTop: 40,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
  },
  btnText: {
    fontWeight: "900",
    color: "#A24BFF",
    fontSize: 16,
  },
});
