import { Image, View } from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Splash Screen
import { LottieSplash } from "./src/features/splash/LottieSplash";

// Auth Screens
import LoginScreen from "./src/features/auth/screens/LoginScreen";
import SignupScreen from "./src/features/auth/screens/SignupScreen";

// Settings Screens (available)
import SettingsScreen from './src/features/settings/settingsScreen';
import AppearanceScreen from './src/features/settings/appearanceScreen';

// Navigation
import type { RootStackParamList } from "./src/navigation/types";
import AppTabs from "@/navigation/AppTabs";

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#B860FF",
  },
};

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!splashDone || !fontsLoaded) {
    return <LottieSplash onFinish={() => setSplashDone(true)} />;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#B860FF" },
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{
                headerShown: true,
                title: "Create Account",
                headerStyle: { backgroundColor: "transparent" },
                headerBackground: () => (
                  <View style={{ flex: 1, backgroundColor: "#B860FF" }}>
                    <Image
                      source={require("./src/assets/blobs/blob-light.png")}
                      style={{
                        position: "absolute",
                        width: 260,
                        height: 260,
                        top: -120,
                        left: -80,
                        transform: [{ rotate: "18deg" }],
                      }}
                      resizeMode="contain"
                    />
                  </View>
                ),
                headerTintColor: "black",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen name="Home" component={AppTabs} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AppearanceScreen" component={AppearanceScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
