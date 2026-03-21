import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";
import { fontFamilies } from "../../config/typography";
import SummaryCard from "./SummaryCard";

type SummaryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "WeeklySummary">;
};

export default function SummaryScreen({ navigation }: SummaryScreenProps) {
  const [weeksData, setWeeksData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeeks() {
      try {
        const response = await fetch("http://localhost:5002/api/insights/historic-weeks/child123");
        if (response.ok) {
          const data = await response.json();
          setWeeksData(data);
        }
      } catch (error) {
        console.error("Failed to fetch historic weeks", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeeks();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Weekly Summary</Text>
      </LinearGradient>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#B860FF" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {weeksData.map((weekData) => (
            <SummaryCard
              key={weekData.id}
              dayLabel={weekData.title}
              date={weekData.dateLabel}
              onPress={() =>
                navigation.navigate("SummaryDetail", { weekData })
              }
            />
          ))}
          {weeksData.length === 0 && (
             <Text style={{ textAlign: "center", marginTop: 20 }}>No weekly data found.</Text>
          )}
        </ScrollView>
      )}
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
