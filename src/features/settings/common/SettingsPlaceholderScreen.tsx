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

type SettingsPlaceholderScreenProps = {
  title: string;
  description: string;
  highlights: string[];
  navigation: {
    goBack: () => void;
  };
};

export default function SettingsPlaceholderScreen({
  title,
  description,
  highlights,
  navigation,
}: SettingsPlaceholderScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9333EA" />
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityRole="button"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{title}</Text>
          <Text style={styles.heroDescription}>{description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHAT YOU CAN DO HERE</Text>
          {highlights.map((highlight) => (
            <View key={highlight} style={styles.item}>
              <View style={styles.itemBullet}>
                <Ionicons name="checkmark" size={14} color="#9333EA" />
              </View>
              <Text style={styles.itemText}>{highlight}</Text>
            </View>
          ))}
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#9333EA",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
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
    gap: 20,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  heroTitle: {
    color: "#1F2937",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  heroDescription: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  sectionTitle: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    color: "#374151",
    fontSize: 15,
    lineHeight: 22,
  },
});
