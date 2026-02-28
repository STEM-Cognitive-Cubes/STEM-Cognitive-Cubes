import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fontFamilies } from "@/config/typography";

type InsightBoxProps = {
  title: string;
  data: { day: string; value: number }[];
  barColor: string;
};

export default function InsightBox({ title, data, barColor }: InsightBoxProps) {
  const maxVal = Math.max(...data.map((d) => d.value));
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
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
  },
  barColumn: { flex: 1, alignItems: "center" },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: "rgba(255, 159, 67, 0.1)",
    borderRadius: 11,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: { width: "100%", borderRadius: 11 },
  barLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginTop: 6,
  },
});
