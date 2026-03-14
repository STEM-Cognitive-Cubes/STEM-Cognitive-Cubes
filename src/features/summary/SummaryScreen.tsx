import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { fontFamilies } from "../../config/typography";
import SummaryCard from "./SummaryCard";

type SummaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "WeeklySummary">;
};

const weeklySessions = [
  { id: "1", dayLabel: "Monday", date: "June 10, 2025" },
  { id: "2", dayLabel: "Tuesday", date: "June 11, 2025" },
  { id: "3", dayLabel: "Wednesday", date: "June 12, 2025" },
  { id: "4", dayLabel: "Thursday", date: "June 13, 2025" },
  { id: "5", dayLabel: "Friday", date: "June 14, 2025" },
  { id: "6", dayLabel: "Saturday", date: "June 15, 2025" },
  { id: "7", dayLabel: "Sunday", date: "June 16, 2025" },
];

export default function SummaryScreen({ navigation }: SummaryScreenProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Weekly Summary</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {weeklySessions.map((session) => (
          <SummaryCard
            key={session.id}
            dayLabel={session.dayLabel}
            date={session.date}
            onPress={() =>
              navigation.navigate("SummaryDetail", { sessionId: session.id })
            }
          />
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
    padding: 20,
    paddingBottom: 40,
  },
});
