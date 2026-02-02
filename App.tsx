import { View, Text, StyleSheet } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import Blob from "./src/components/Blob";
import { blobPresets, colors } from "./src/config/theme";
import { fontFamilies } from "./src/config/typography";

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
    <View style={styles.container}>
      <Blob
        preset="purpleCloud"
        style={{
          ...blobPresets.primary,
          top: -120,
          left: -140,
        }}
      />
      <Blob
        preset="softPurpleCloud"
        opacity={0.7}
        style={{
          ...blobPresets.soft,
          top: 120,
          right: -140,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Auth Screens</Text>
        <Text style={styles.subTitle}>Blob layers are ready.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.blue,
    fontFamily: fontFamilies.bold,
  },
  subTitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.blue,
    fontFamily: fontFamilies.regular,
  },
});
