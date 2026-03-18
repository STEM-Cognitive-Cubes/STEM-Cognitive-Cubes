import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

type MaterialCommunityIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type SkillCardProps = {
  title: string;
  level: string;
  progress: number;
  color: string;
  iconName: MaterialCommunityIconName;
};

export default function SkillCard({
  title,
  level,
  progress,
  color,
  iconName,
}: SkillCardProps) {
  return (
    <View style={styles.card}>
      <MaterialCommunityIcons
        name={iconName}
        size={32}
        color={color}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.level, { color }]}>{level}</Text>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progress * 100}%`, backgroundColor: color },
          ]}
        />
      </View>
      <View style={styles.dots}>
        <Text style={styles.dotsText}>...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  level: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  dots: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  dotsText: {
    color: "#D1D5DB",
  },
});
