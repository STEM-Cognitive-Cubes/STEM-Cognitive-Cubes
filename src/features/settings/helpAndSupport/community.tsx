import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "CommunityScreen">;

const communitySections = [
  {
    title: "Weekly Challenges",
    description: "Discover guided building prompts for parents and children.",
    icon: "trophy-outline" as const,
    color: "#F59E0B",
  },
  {
    title: "Parent Tips",
    description: "Read short ideas from other families using the cubes at home.",
    icon: "bulb-outline" as const,
    color: "#10B981",
  },
  {
    title: "Featured Builds",
    description: "Browse standout structures and milestone moments from the community.",
    icon: "star-outline" as const,
    color: "#EC4899",
  },
];

export default function CommunityScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Community</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>A moderated space for parents</Text>
          <Text style={styles.heroText}>
            Explore activities, browse shared ideas, and learn how other families use STEM
            Cognitive Cubes during play sessions.
          </Text>
        </View>

        {communitySections.map((section) => (
          <View key={section.title} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: `${section.color}18` }]}>
              <Ionicons name={section.icon} size={24} color={section.color} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardText}>{section.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    backgroundColor: "#9333EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
});
