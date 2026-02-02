import { View, Text, StyleSheet } from "react-native";

import Blob from "./src/components/Blob";
import { blobPresets, colors } from "./src/config/theme";

export default function App() {
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
  },
  subTitle: {
    marginTop: 8,
    fontSize: 16,
    color: colors.blue,
  },
});
