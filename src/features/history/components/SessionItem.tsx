import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fontFamilies } from "@/config/typography";
type SessionItemProps = {
  title: string;
  date: string;
  time: string;
  duration: string;
  dotColor: string;
  onPress?: () => void;
};
export default function SessionItem({
  title,
  date,
  time,
  duration,
  dotColor,
  onPress,
}: SessionItemProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          {date} • {time}
        </Text>
      </View>
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{duration}</Text>
      </View>
      <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "black",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
  },
  durationBadge: {
    backgroundColor: "rgba(184, 96, 255, 0.12)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  durationText: {
    fontSize: 11,
    fontFamily: fontFamilies.semiBold,
    color: "#B860FF",
  },
});
