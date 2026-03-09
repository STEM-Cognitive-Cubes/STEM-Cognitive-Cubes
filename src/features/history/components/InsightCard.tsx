import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFamilies } from "@/config/typography";
type InsightCardProps = {
  text: string;
};
export default function InsightCard({ text }: InsightCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Development Insight</Text>
      <View style={styles.card}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: "black",
    marginBottom: 10,
  },
  card: {
    borderWidth: 1.5,
    borderColor: "#B860FF",
    borderRadius: 14,
    padding: 14,
    backgroundColor: "rgba(184, 96, 255, 0.05)",
  },
  text: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.7)",
    lineHeight: 20,
  },
});
