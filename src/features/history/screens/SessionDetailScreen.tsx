import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/types";
import { fontFamilies } from "../../../config/typography";

type SessionDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SessionDetail">;
  route: RouteProp<RootStackParamList, "SessionDetail">;
};

export default function SessionDetailScreen({
  navigation,
  route,
}: SessionDetailScreenProps) {
  const { sessionId } = route.params;
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5002' : 'http://localhost:5002';

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch(`${API_URL}/api/history/session/${sessionId}`, {
          headers: { Authorization: "Bearer mock-token-123" }
        });
        if (response.ok) {
          const data = await response.json();
          setDetail(data);
        }
      } catch (error) {
        console.error("Failed to fetch session detail", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#B860FF" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Session not found.</Text>
      </View>
    );
  }

  const metrics = [
    { label: "Duration", value: detail.durationMinutes, icon: "clock", color: "#B860FF" },
    { label: "Blocks", value: `${detail.blocks}`, icon: "box", color: "#B860FF" },
    { label: "Focus", value: detail.focusLevel, icon: "target", color: "#B860FF" },
    { label: "Score", value: `${detail.score}`, icon: "star", color: "#B860FF" },
  ];
  
  // The mockup does not use custom colors for metric texts/icons, mostly dark grey + purple accents, except maybe just plain layout.
  // Actually, wait, the mockup has purple, blue, green colors? "45m" is bold black, under it "Duration" small. Above it a purple clock.
  // We'll mimic the mockup exactly: icons are colored.
  const iconColors = ["#B860FF", "#B860FF", "#B860FF", "#B860FF"];
  metrics.forEach((m, i) => m.color = iconColors[i]);

  const maxFocus = Math.max(...detail.focusData.map((d: any) => d.value), 10);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 3D Build Preview Card */}
        <View style={styles.previewCard}>
          <Feather name="box" size={50} color="#a0aec0" />
          <Text style={styles.previewTitle}>{detail.title}</Text>
          <Text style={styles.previewDate}>
            {detail.dateLabel}  •  {detail.timeLabel}
          </Text>
        </View>

        {/* Metric Pills Array wrapped in a border */}
        <View style={styles.metricsWrapper}>
          {metrics.map((m, index) => (
            <View 
              key={m.label} 
              style={[
                styles.metricItem, 
                index !== metrics.length - 1 ? styles.metricDivider : null
              ]}
            >
              <View style={styles.iconCircle}>
                <Feather name={m.icon as any} size={16} color={m.color} />
              </View>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={styles.metricLabel}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* AI Insight */}
        <Text style={styles.sectionHeader}>AI DEVELOPMENT INSIGHT</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightAccent} />
          <Text style={styles.insightText}>{detail.aiInsight}</Text>
        </View>

        {/* Focus Analysis Bar Chart */}
        <View style={styles.chartOuterCard}>
          <Text style={styles.chartTitle}>Focus Analysis</Text>
          <View style={styles.chartContainer}>
            {detail.focusData.map((d: any) => (
              <View key={d.day} style={styles.barColumn}>
                <View style={[
                  styles.bar,
                  {
                    height: `${(d.value / maxFocus) * 100}%`,
                    backgroundColor: "#B860FF",
                  },
                ]} />
              </View>
            ))}
          </View>
          <Text style={styles.chartSubtitle}>Great steady focus maintained throughout the session</Text>
        </View>

        {/* Blocks Used */}
        <Text style={styles.sectionTitle}>BLOCKS USED</Text>
        <View style={styles.blocksRow}>
          {detail.blocksUsed.map((block: any) => (
            <View key={block.id} style={[styles.blockChip, { backgroundColor: `${block.color}15` }]}>
              <View style={[styles.blockDot, { backgroundColor: block.color }]} />
              <Text style={styles.blockName}>{block.name}</Text>
              <Text style={[styles.blockCount, { color: block.color }]}>×{block.count}</Text>
            </View>
          ))}
        </View>

        {/* Export Summary Button */}
        <Pressable
          style={styles.exportButton}
          onPress={() => console.log('Exporting session summary...')}
        >
          <Feather name="download" size={18} color="white" style={{ marginRight: 8 }} />
          <Text style={styles.exportButtonText}>Export Summary</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  previewCard: {
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#00A4EF",
    padding: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: "#718096",
    marginTop: 15,
  },
  previewDate: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: "#A0AEC0",
    marginTop: 4,
  },
  metricsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#B860FF",
    borderRadius: 24,
    marginBottom: 25,
    overflow: "hidden",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  metricDivider: {
    borderRightWidth: 1,
    borderRightColor: "rgba(184, 96, 255, 0.3)",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B860FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontFamily: fontFamilies.bold,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    color: "#A0AEC0",
  },
  sectionHeader: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: "#718096",
    marginBottom: 10,
    marginLeft: 4,
  },
  insightCard: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF9F43",
    padding: 20,
    marginBottom: 25,
    overflow: "hidden",
  },
  insightAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: "#FF9F43",
  },
  insightText: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: "#2D3748",
    lineHeight: 20,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fontFamilies.bold,
    color: "#718096",
    marginBottom: 12,
    marginLeft: 4,
  },
  chartOuterCard: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD54F",
    padding: 16,
    marginBottom: 25,
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: fontFamilies.bold,
    color: "#A0AEC0",
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 100,
    paddingHorizontal: 10,
  },
  barColumn: {
    flex: 1,
    alignItems: "center",
  },
  bar: {
    width: 20,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  chartSubtitle: {
    fontSize: 11,
    fontFamily: fontFamilies.semiBold,
    fontStyle: 'italic',
    color: "#A0AEC0",
    textAlign: "center",
    marginTop: 16,
  },
  blocksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  blockChip: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  blockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  blockName: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: "#2D3748",
    marginRight: 6,
  },
  blockCount: {
    fontSize: 12,
    fontFamily: fontFamilies.bold,
  },
  exportButton: {
    backgroundColor: "#4A5EB4",
    flexDirection: "row",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  exportButtonText: {
    fontSize: 15,
    fontFamily: fontFamilies.semiBold,
    color: "white",
  },
});
