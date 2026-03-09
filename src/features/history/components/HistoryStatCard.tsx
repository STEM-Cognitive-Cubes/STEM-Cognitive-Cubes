import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fontFamilies } from "@/config/typography";
type HistoryStatCardProps = {
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
};
export default function HistoryStatCard({
  label,
  value,
  icon,
  color,
  bgColor,
}: HistoryStatCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Feather name={icon as any} size={18} color="white" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    margin: 6,
    alignItems: "center",
    minHeight: 110,
    justifyContent: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: "black",
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.6)",
    textAlign: "center",
  },
});
