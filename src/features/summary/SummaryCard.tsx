import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fontFamilies } from "../../config/typography";
type SummaryCardProps = {
  date: string;
  dayLabel: string;
  onPress?: () => void;
};
export default function SummaryCard({ date, dayLabel, onPress }: SummaryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Feather name="box" size={28} color="#B860FF" />
      </View>
      <View style={styles.info}>
        <Text style={styles.dayLabel}>{dayLabel}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#FFD54F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(184, 96, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  dayLabel: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "black",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
  },
});
