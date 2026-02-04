import { Image, View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./src/features/auth/screens/LoginScreen";
import SignupScreen from "./src/features/auth/screens/SignupScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();
const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#B860FF",
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
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
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
