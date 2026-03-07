import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { fontFamilies } from "@/config/typography";
type Tab = {
  key: string;
  label: string;
  icon: string;
};
const tabs: Tab[] = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "History", label: "History", icon: "clock" },
  { key: "Settings", label: "Settings", icon: "settings" },
  { key: "Insights", label: "Insights", icon: "bar-chart-2" },
  { key: "Profile", label: "Profile", icon: "user" },
];
type BottomTabBarProps = {
  activeTab: string;
  onTabPress: (tabKey: string) => void;
};
export default function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
          >
            <Feather
              name={tab.icon as any}
              size={22}
              color={isActive ? "#B860FF" : "rgba(0,0,0,0.4)"}
            />
            <Text
              style={[
                styles.label,
                { color: isActive ? "#B860FF" : "rgba(0,0,0,0.4)" },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    paddingBottom: 24, // Safe area
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    marginTop: 4,
  },
});
