import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/features/home/screens/HomeScreen";
import HistoryScreen from "@/features/history/screens/HistoryScreen";
import InsightsScreen from "@/features/insights/InsightsScreen";
import SettingsScreen from "@/features/settings/settingsScreen";

// TEMP screens (replace later with your real ones)
import { View, Text } from "react-native";

function TempScreen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>{title}</Text>
    </View>
  );
}

import BlokCTabBar from "@/navigation/components/BlokCTabBar";

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BlokCTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" children={() => <TempScreen title="Settings" />} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" children={() => <TempScreen title="Profile" />} />
    </Tab.Navigator>
  );
}
