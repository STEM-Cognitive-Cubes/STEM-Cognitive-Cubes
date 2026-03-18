import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type StatItemProps = {
  icon: MaterialCommunityIconName;
  label: string;
  subLabel: string;
  color: string;
  iconColor: string;
};

export default function StatItem({
  icon,
  label,
  subLabel,
  color,
  iconColor,
}: StatItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor: color }]}>
        <MaterialCommunityIcons name={icon} size={28} color={iconColor} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>{subLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 12,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
});
