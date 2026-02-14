import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BotIntroScreen2({ navigation }: any) {

  const finishIntro = async () => {
    await AsyncStorage.setItem("bot_intro_seen", "true");
    navigation.replace("BotChat");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={["#cf92fe", "#A24BFF", "#B860FF"]} style={styles.container}>

        <Text style={styles.title}>I Can Help You With:</Text>

        <View style={styles.list}>
          <Text style={styles.item}>• Session issues</Text>
          <Text style={styles.item}>• Understanding insights</Text>
          <Text style={styles.item}>• Hive connectivity</Text>
          <Text style={styles.item}>• Rewards & tracking</Text>
        </View>

        <Pressable style={styles.btn} onPress={finishIntro}>
          <Text style={styles.btnText}>Start Chatting</Text>
        </Pressable>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 24 },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFE572",
    textAlign: "center",
  },

  list: {
    marginTop: 30,
    gap: 18,
  },

  item: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },

  btn: {
    marginTop: 40,
    alignSelf: "center",
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
