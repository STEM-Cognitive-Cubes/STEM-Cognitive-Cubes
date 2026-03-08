import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../../../navigation/types";
import { fontFamilies } from "../../../config/typography";
type RecommendationsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Recommendations">;
  route: RouteProp<RootStackParamList, "Recommendations">;
};
type Recommendation = {
  id: string;
  name: string;
  bgColor: string;
  iconColor: string;
};
const recommendationsData: Record<string, Recommendation[]> = {
  Cognitive: [
    { id: "1", name: "Memory Match Game", bgColor: "#E8F5E9", iconColor: "#1DBE5F" },
    { id: "2", name: "Pattern Recognition", bgColor: "#FFF3E0", iconColor: "#FF9F43" },
    { id: "3", name: "Sequence Builder", bgColor: "#F3E5F5", iconColor: "#B860FF" },
  ],
  Creativity: [
    { id: "1", name: "Drawing & Colouring Game", bgColor: "#FFF3E0", iconColor: "#FF9F43" },
    { id: "2", name: "Story Builder", bgColor: "#F3E5F5", iconColor: "#B860FF" },
    { id: "3", name: "Music Maker", bgColor: "#E8F5E9", iconColor: "#1DBE5F" },
  ],
  "Problem-solving": [
    { id: "1", name: "Maze Game", bgColor: "#F3E5F5", iconColor: "#B860FF" },
    { id: "2", name: "Logic Puzzles", bgColor: "#E8F5E9", iconColor: "#1DBE5F" },
    { id: "3", name: "Bridge Builder", bgColor: "#FFF3E0", iconColor: "#FF9F43" },
  ],
};
export default function RecommendationsScreen({
  navigation,
  route,
}: RecommendationsScreenProps) {
  const category = route.params?.category ?? "Cognitive";
  const recommendations = recommendationsData[category] ?? recommendationsData.Cognitive;
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#B860FF", "#9B40E0"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Recommendations</Text>
        <Text style={styles.headerSubtitle}>
          Activities to improve {category.toLowerCase()}
        </Text>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {recommendations.map((rec) => (
          <Pressable key={rec.id} style={[styles.card, { backgroundColor: rec.bgColor }]}>
            <View style={[styles.imageContainer, { backgroundColor: `${rec.iconColor}20` }]}>
              {/* Replace with actual illustration images */}
              <Feather name="play-circle" size={36} color={rec.iconColor} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>{rec.name}</Text>
              <Feather name="chevron-right" size={18} color="rgba(0,0,0,0.4)" />
            </View>
          </Pressable>
        ))}
        <Pressable style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>See More</Text>
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
  headerSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardName: {
    fontSize: 15,
    fontFamily: fontFamilies.semiBold,
    color: "black",
    flex: 1,
  },
  seeMoreButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  seeMoreText: {
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    color: "#B860FF",
  },
});
