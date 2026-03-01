import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@/features/home/screens/HomeScreen";

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
      <Tab.Screen name="History" children={() => <TempScreen title="History" />} />
      <Tab.Screen name="Settings" children={() => <TempScreen title="Settings" />} />
      <Tab.Screen name="Insights" children={() => <TempScreen title="Insights" />} />
      <Tab.Screen name="Profile" children={() => <TempScreen title="Profile" />} />
    </Tab.Navigator>
  );
}
