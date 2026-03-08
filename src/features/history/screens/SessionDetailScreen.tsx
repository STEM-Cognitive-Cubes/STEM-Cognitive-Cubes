import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/types";
import { fontFamilies } from "../../../config/typography";
import InsightCard from "../components/InsightCard";
import { sessionDetailsMap } from "../config/historyData";
import { LinearGradient } from "expo-linear-gradient";
type SessionDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SessionDetail">;
  route: RouteProp<RootStackParamList, "SessionDetail">;
};
export default function SessionDetailScreen({
  navigation,
  route,
}: SessionDetailScreenProps) {
  const { sessionId } = route.params;
  const detail = sessionDetailsMap[sessionId];
  // Fallback if session not found
  if (!detail) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Feather name="alert-circle" size={48} color="#B860FF" />
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Session not found</Text>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }
  const metrics = [
    { label: "Duration", value: detail.duration, icon: "clock", color: "#B860FF" },
    { label: "Blocks", value: `${detail.blocks}`, icon: "box", color: "#FF9F43" },
    { label: "Focus", value: detail.focusLevel, icon: "target", color: "#1DBE5F" },
    { label: "Score", value: `${detail.score}`, icon: "star", color: "#FFD54F" },
  ];
  const maxFocus = Math.max(...detail.focusData.map((d) => d.value));
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Pressable onPress={() => navigation.goBack()} style={styles.headerBack}>
          <Feather name="arrow-left" size={22} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Session Detail</Text>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 3D Build Preview Card */}
        <View style={styles.previewCard}>
          <Feather name="box" size={40} color="#B860FF" />
          <Text style={styles.previewTitle}>3D Build Preview</Text>
          <Text style={styles.previewDate}>
            {detail.date} • {detail.time}
          </Text>
        </View>
        {/* Metric Pills */}
        <View style={styles.metricsRow}>
          {metrics.map((m) => (
            <View
              key={m.label}
              style={[styles.metricPill, { backgroundColor: `${m.color}15` }]}
            >
              <Feather name={m.icon as any} size={14} color={m.color} />
              <Text style={[styles.metricValue, { color: m.color }]}>
                {m.value}
              </Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
        {/* AI Insight */}
        <InsightCard text={detail.aiInsight} />
        {/* Focus Analysis Bar Chart */}
        <Text style={styles.sectionTitle}>Focus Analysis</Text>
        <View style={styles.chartContainer}>
          {detail.focusData.map((d) => (
            <View key={d.day} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: `${(d.value / maxFocus) * 100}%`,
                      backgroundColor: "#B860FF",
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{d.day}</Text>
            </View>
          ))}
        </View>
        {/* Blocks Used */}
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
                ×{block.count}
              </Text>
            </View>
          ))}
        </View>
        {/* Export Summary Button */}
        <Pressable
          style={styles.exportButton}
          onPress={() => navigation.navigate("WeeklySummary")}
        >
          <Text style={styles.exportButtonText}>Export Summary</Text>
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
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  headerBack: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fontFamilies.bold,
    color: "white",
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
    backgroundColor: "#FFD54F",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "black",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#B860FF",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "white",
  },
});
