import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { fontFamilies } from "@/config/typography";
type InsightBoxProps = {
  title: string;
  score: number;
  maxScore: number;
  improvement: string;
  data: { day: string; value: number }[];
  barColor: string;
  mascotSource?: any; // require("../assets/mascot.png")
};
export default function InsightBox({
  title,
  score,
  maxScore,
  improvement,
  data,
  barColor,
  mascotSource,
}: InsightBoxProps) {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        {data.map((d) => (
          <View key={d.day} style={styles.barColumn}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(d.value / maxVal) * 100}%`,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{d.day}</Text>
          </View>
        ))}
      </View>
      {/* Score Row */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Current Score</Text>
          <Text style={styles.scoreValue}>
            {score}
            <Text style={styles.scoreMax}>/{maxScore}</Text>
          </Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Improvement</Text>
          <Text style={styles.improvementValue}>{improvement}</Text>
        </View>
      </View>
      {/* Mascot */}
      {mascotSource && (
        <Image source={mascotSource} style={styles.mascot} resizeMode="contain" />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: "black",
    marginBottom: 14,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 140,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: "rgba(255, 159, 67, 0.1)",
    borderRadius: 11,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 11,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginTop: 6,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  scoreLabel: {
    fontSize: 11,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    color: "black",
  },
  scoreMax: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.4)",
  },
  improvementValue: {
    fontSize: 20,
    fontFamily: fontFamilies.bold,
    color: "#1DBE5F",
  },
  mascot: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginTop: 8,
  },
});

