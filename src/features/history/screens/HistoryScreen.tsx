import React, { useMemo } from "react";
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import { fontFamilies } from "@/config/typography";
import HistoryStatCard from "../components/HistoryStatCard";
import SessionItemComponent from "../components/SessionItem";
import { sessionStats, recentSessions } from "../config/historyData";
import { groupSessionsByDay } from "../config/groupSessions";

type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "History">;
};

export default function HistoryScreen({ navigation }: HistoryScreenProps) {
  const sections = useMemo(() => groupSessionsByDay(recentSessions), []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>History</Text>
      </LinearGradient>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
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

            <Pressable
              style={styles.weeklyHistoryButton}
              onPress={() => navigation.navigate("WeeklySummary")}
            >
              <Text style={styles.weeklyHistoryButtonText}>View Weekly History</Text>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <Pressable onPress={() => navigation.navigate("SessionHistory")}>
                <Text style={styles.seeMore}>See more</Text>
              </Pressable>
            </View>
          </>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.dateLabel}>{title}</Text>
        )}
        renderItem={({ item: session }) => (
          <SessionItemComponent
            title={session.title}
            date={session.date}
            time={session.time}
            duration={session.duration}
            dotColor={session.dotColor}
            onPress={() =>
              navigation.navigate("SessionDetail", { sessionId: session.id })
            }
          />
        )}
      />
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
  weeklyHistoryButton: {
    backgroundColor: "#B860FF",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weeklyHistoryButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.bold,
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
