import { View } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/features/auth/screens/LoginScreen";
import SignupScreen from "./src/features/auth/screens/SignupScreen";
import type { RootStackParamList } from "./src/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              headerShown: true,
              title: "Create Account",
              headerStyle: { backgroundColor: "#B860FF" },
              headerTintColor: "black",
              headerShadowVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
