import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { fontFamilies } from "@/config/typography";
import InsightBox from "./InsightBox";
import MascotInsight from "./MascotInsight";

type InsightsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Insights">;
};

const tabs = ["Cognitive", "Creativity", "Problem-solving"] as const;
type TabKey = (typeof tabs)[number];

const insightsData: Record<TabKey, {
  title: string;
  score: number;
  improvement: string;
  data: { day: string; value: number }[];
  barColor: string;
  insightMessage: string;
}> = {
  Cognitive: {
    title: "Cognitive Growth",
    score: 70,
    improvement: "+12%",
    data: [
      { day: "Mon", value: 50 },
      { day: "Tue", value: 65 },
      { day: "Wed", value: 45 },
      { day: "Thu", value: 80 },
      { day: "Fri", value: 70 },
      { day: "Sat", value: 75 },
      { day: "Sun", value: 60 },
    ],
    barColor: "#FF9F43",
    insightMessage: "Your child has shown great cognitive improvement over the past few days! 🧠",
  },
  Creativity: {
    title: "Creative Growth",
    score: 65,
    improvement: "+8%",
    data: [
      { day: "Mon", value: 40 },
      { day: "Tue", value: 55 },
      { day: "Wed", value: 70 },
      { day: "Thu", value: 60 },
      { day: "Fri", value: 75 },
      { day: "Sat", value: 80 },
      { day: "Sun", value: 65 },
    ],
    barColor: "#FFD54F",
    insightMessage: "Creative thinking is blossoming! Keep encouraging imaginative play. 🎨",
  },
  "Problem-solving": {
    title: "Problem-Solving Growth",
    score: 75,
    improvement: "+15%",
    data: [
      { day: "Mon", value: 60 },
      { day: "Tue", value: 70 },
      { day: "Wed", value: 55 },
      { day: "Thu", value: 85 },
      { day: "Fri", value: 80 },
      { day: "Sat", value: 90 },
      { day: "Sun", value: 72 },
    ],
    barColor: "#FF9F43",
    insightMessage: "Outstanding problem-solving progress this week! Keep it up. 🚀",
  },
};

export default function InsightsScreen({ navigation }: InsightsScreenProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("Cognitive");
  const current = insightsData[activeTab];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Development Insights</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab Pills */}
        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Chart + Score */}
        <InsightBox
          title={current.title}
          score={current.score}
          maxScore={100}
          improvement={current.improvement}
          data={current.data}
          barColor={current.barColor}
        />

        {/* Mascot + Insight Message */}
        <MascotInsight message={current.insightMessage} />

        {/* Export Report Button */}
        <Pressable style={styles.exportButton} onPress={() => {}}>
          <Text style={styles.exportButtonText}>Export report</Text>
        </Pressable>

        {/* Recommendations Link */}
        <Pressable
          style={styles.recommendationsLink}
          onPress={() => navigation.navigate("Recommendations", { category: activeTab })}
        >
          <Text style={styles.recommendationsText}>View Recommendations →</Text>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: fontFamilies.bold,
    color: "white",
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabPillActive: {
    backgroundColor: "#B860FF",
  },
  tabText: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: "rgba(0,0,0,0.6)",
  },
  tabTextActive: {
    color: "white",
  },
  exportButton: {
    backgroundColor: "#FFD54F",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  exportButtonText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "black",
  },
  recommendationsLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  recommendationsText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "#B860FF",
  },
});
