import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList, WeekSummaryData } from "../../navigation/types";
import { fontFamilies } from "../../config/typography";
import InsightCard from "../history/components/InsightCard";


type SummaryDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SummaryDetail">;
  route: RouteProp<RootStackParamList, "SummaryDetail">;
};

export default function SummaryDetailScreen({
  navigation,
  route
}: SummaryDetailScreenProps) {
  const detail: WeekSummaryData = route.params.weekData;

  const handleExportSummary = () => {
    Alert.alert(
      "Export Unavailable",
      "Summary export is not available yet in this screen."
    );
  };

  const metrics = [
    { label: "Duration", value: detail.durationMinutes, icon: "clock", color: "#B860FF" },
    { label: "Blocks", value: `${detail.blocks}`, icon: "box", color: "#FF9F43" },
    { label: "Focus", value: detail.focusLevel, icon: "target", color: "#1DBE5F" },
    { label: "Score", value: `${detail.score}`, icon: "star", color: "#FFD54F" },
  ];
  
  const maxFocus = Math.max(...detail.focusData.map((item) => item.value), 10);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewCard}>
          <Feather name="box" size={40} color="#B860FF" />
          <Text style={styles.previewTitle}>Weekly Summary</Text>
          <Text style={styles.previewDate}>{detail.title} | {detail.dateLabel}</Text>
        </View>

        <View style={styles.metricsRow}>
          {metrics.map((metric) => (
            <View
              key={metric.label}
              style={[styles.metricPill, { backgroundColor: `${metric.color}15` }]}
            >
              <Feather name={metric.icon as any} size={14} color={metric.color} />
              <Text style={[styles.metricValue, { color: metric.color }]}>
                {metric.value}
              </Text>
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
          ))}
        </View>

        <InsightCard text={detail.aiInsight} />

        <Text style={styles.sectionTitle}>Focus Analysis</Text>
        <View style={styles.chartContainer}>
          {detail.focusData.map((item) => (
            <View key={item.day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(item.value / maxFocus) * 100}%`,
                      backgroundColor: "#B860FF",
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{item.day}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Blocks Used</Text>
        <View style={styles.blocksRow}>
          {detail.blocksUsed.map((block) => (
            <View
              key={block.id}
              style={[styles.blockChip, { backgroundColor: `${block.color}15` }]}
            >
              <View style={[styles.blockDot, { backgroundColor: block.color }]} />
              <Text style={styles.blockName}>{block.name}</Text>
              <Text style={[styles.blockCount, { color: block.color }]}>
                x{block.count}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          style={styles.exportButton}
          onPress={handleExportSummary}
        >
          <Feather name="download" size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.exportButtonText}>Export Summary</Text>
        </Pressable>

        <Pressable
          style={[styles.exportButton, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#4A5EB4", marginTop: 12 }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={18} color="#4A5EB4" style={{ marginRight: 8 }} />
          <Text style={[styles.exportButtonText, { color: "#4A5EB4" }]}>Go Back</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0FF",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: "black",
    marginTop: 10,
  },
  previewDate: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metricPill: {
    flex: 1,
    alignItems: "center",
    borderRadius: 14,
    paddingVertical: 12,
    marginHorizontal: 3,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: "black",
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
    width: 24,
    height: 100,
    backgroundColor: "rgba(184, 96, 255, 0.08)",
    borderRadius: 12,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  bar: {
    width: "100%",
    borderRadius: 12,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    color: "rgba(0,0,0,0.5)",
    marginTop: 6,
  },
  blocksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  blockChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  blockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  blockName: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: "black",
    marginRight: 4,
  },
  blockCount: {
    fontSize: 12,
    fontFamily: fontFamilies.bold,
  },
  exportButton: {
    backgroundColor: "#4A5EB4",
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "white",
  },
});
