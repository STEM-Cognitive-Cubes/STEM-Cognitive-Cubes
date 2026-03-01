import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import BotBubbleFab from "@/components/BotBubbleFab";

export default function BotIntroScreen1({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={["#cf92fe", "#A24BFF", "#B860FF"]}
        style={styles.container}
      >
        {/* ONLY the floating bot — no background circle */}
        <View style={styles.orbWrap}>
          <BotBubbleFab
            size={130}       // adjust if you want slightly bigger/smaller
            mode="inline"
            disabled
          />
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

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  orbWrap: {
    marginBottom: 50,  // slight spacing
    alignItems: "center",
    justifyContent: "center",
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