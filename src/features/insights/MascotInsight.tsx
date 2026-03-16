import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fontFamilies } from "@/config/typography";

type MascotInsightProps = {
  message: string;
};

export default function MascotInsight({ message }: MascotInsightProps) {
  return (
    <View style={styles.card}>
      <Image
        source={require("../../assets/mascot/mascot.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.label}>AI Insight</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
  },
  image: {
    width: 72,
    height: 72,
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: "#9333EA",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.regular,
    color: "#374151",
  },
});
