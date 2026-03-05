import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";

// Import your screens based on your file structure
import HomeScreen from "@/features/home/screens/HomeScreen";
import SettingsScreen from "@/features/settings/settingsScreen";
import ProfileScreen from "@/features/profile/profile";
import BlokCTabBar from "@/navigation/components/BlokCTabBar";

// TEMP screens (replace later with your real ones)
function TempScreen({ title }: { title: string }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "800" }}>{title}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BlokCTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" children={() => <TempScreen title="History" />} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Insights" children={() => <TempScreen title="Insights" />} />
      {/* Profile screen is now linked to the Profile Tab */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}