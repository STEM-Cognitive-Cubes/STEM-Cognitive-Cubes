import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/features/home/screens/HomeScreen";
import HistoryScreen from "@/features/history/screens/HistoryScreen";
import InsightsScreen from "@/features/insights/InsightsScreen";
import SettingsScreen from "@/features/settings/settingsScreen";
import ProfileScreen from "@/features/profile/profile";
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
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

