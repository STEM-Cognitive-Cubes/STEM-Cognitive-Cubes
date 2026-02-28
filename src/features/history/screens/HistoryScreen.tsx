import React from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { colors } from "@/config/theme";
import { fontFamilies } from "@/config/typography";
import HistoryStatCard from "../components/HistoryStatCard";
import SessionItemComponent from "../components/SessionItem";
import { sessionStats, recentSessions } from "../config/historyData";
type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "History">;
};
export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  // Group sessions by dateLabel
  const grouped = recentSessions.reduce<Record<string, typeof recentSessions>>(
    (acc, session) => {
      const key = session.dateLabel ?? session.date;
      if (!acc[key]) acc[key] = [];
      acc[key].push(session);
      return acc;
    },
    {}
  );
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>History</Text>
      </LinearGradient>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stat Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            {sessionStats.slice(0, 2).map((stat) => (
              <HistoryStatCard key={stat.id} {...stat} />
            ))}
          </View>
          <View style={styles.statsRow}>
            {sessionStats.slice(2, 4).map((stat) => (
              <HistoryStatCard key={stat.id} {...stat} />
            ))}
          </View>
        </View>
        {/* Recent Activities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <Pressable
            onPress={() => navigation.navigate("SessionHistory")}
          >
            <Text style={styles.seeMore}>See more</Text>
          </Pressable>
        </View>
        {Object.entries(grouped).map(([label, sessions]) => (
          <View key={label}>
            <Text style={styles.dateLabel}>{label}</Text>
            {sessions.map((session) => (
              <SessionItemComponent
                key={session.id}
                title={session.title}
                date={session.date}
                time={session.time}
                duration={session.duration}
                dotColor={session.dotColor}
                onPress={() =>
                  navigation.navigate("SessionDetail", { sessionId: session.id })
                }
              />
            ))}
          </View>
        ))}
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
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  statsGrid: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.bold,
    color: "black",
  },
  seeMore: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: "#B860FF",
  },
  dateLabel: {
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
    color: "rgba(0,0,0,0.5)",
    marginBottom: 8,
    marginTop: 4,
  },
});
