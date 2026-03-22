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

// Bot Screens
import BotStack from './src/features/bot/navigation/BotStack';

// Settings Screens (available)
import SettingsScreen from './src/features/settings/settingsScreen';
import AppearanceScreen from './src/features/settings/appearanceScreen';
import NotificationPreferencesScreen from './src/features/settings/notificationScreen';
import AccountScreen from './src/features/settings/account/accountScreen';
import EditProfileScreen from './src/features/settings/account/editProfileScreen';
import ChangePasswordScreen from './src/features/settings/account/changePasswordScreen';
import DeleteAccountScreen from './src/features/settings/account/deleteAccountScreen';
import ContactSupportScreen from './src/features/settings/contactSupportScreen';
import HelpSupportScreen from './src/features/settings/helpAndSupport/helpScreen';
import CommunityScreen from './src/features/settings/helpAndSupport/community';
import EmailScreen from './src/features/settings/helpAndSupport/emailSupport';
import ChatScreen from './src/features/settings/helpAndSupport/liveChat';
import UserGuideScreen from './src/features/settings/helpAndSupport/userGuide/userGuide';
import AppFeaturesScreen from './src/features/settings/helpAndSupport/userGuide/appFeatures';
import OperateScreen from './src/features/settings/helpAndSupport/userGuide/operateScreen';
import ProductIntroScreen from './src/features/settings/helpAndSupport/userGuide/productIntro';
import PrivacyControlsScreen from './src/features/settings/privacyControlsScreen';
import FAQsScreen from './src/features/settings/faqsScreen';
import DataSharingScreen from './src/features/settings/dataSharingScreen';
import RecommendationsScreen from './src/features/recommendations/RecommendationsScreen';
import SummaryScreen from './src/features/summary/SummaryScreen';
import SummaryDetailScreen from './src/features/summary/SummaryDetailScreen';

//session
import StartSessionScreen from "./src/features/play-session/screens/StartSessionScreen";
import LiveSessionScreen from "./src/features/play-session/screens/LiveSessionScreen";

// Navigation Types
import type { RootStackParamList } from "./src/navigation/types";
import AppTabs from "@/navigation/AppTabs";

// Profile Screens
import AddChildScreen from './src/features/profile/add-new-child/add-child';

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
            <Stack.Screen name="Bot" component={BotStack} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="MainTabs" component={AppTabs} />
            <Stack.Screen name="StartSession" component={StartSessionScreen} />
            <Stack.Screen name="LiveSession" component={LiveSessionScreen} />
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
            <Stack.Screen name="AppearanceScreen" component={AppearanceScreen} />
            <Stack.Screen name="NotificationPreferencesScreen" component={NotificationPreferencesScreen} />
            <Stack.Screen name="ContactSupportScreen" component={ContactSupportScreen} />            
            <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} />
            <Stack.Screen name="CommunityScreen" component={CommunityScreen} />
            <Stack.Screen name="EmailScreen" component={EmailScreen} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
            <Stack.Screen name="AppFeatures" component={AppFeaturesScreen} />
            <Stack.Screen name="OperateScreen" component={OperateScreen} />
            <Stack.Screen name="ProductIntro" component={ProductIntroScreen} />
            <Stack.Screen name="UserGuideScreen" component={UserGuideScreen} />
            <Stack.Screen name="DataSharingScreen" component={DataSharingScreen} />            
            <Stack.Screen name="PrivacyControlsScreen" component={PrivacyControlsScreen}  />          
            <Stack.Screen name="AddChild" component={AddChildScreen} />
            <Stack.Screen name="FAQsScreen" component={FAQsScreen} />
            <Stack.Screen name="Recommendations" component={RecommendationsScreen} />           
            <Stack.Screen name="WeeklySummary" component={SummaryScreen} />
            <Stack.Screen name="SummaryDetail" component={SummaryDetailScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
