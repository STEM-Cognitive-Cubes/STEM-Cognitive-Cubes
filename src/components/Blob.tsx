import { LinearGradient } from "expo-linear-gradient";
import type { StyleProp, ViewStyle } from "react-native";

import { gradients } from "../config/theme";

type BlobPreset = keyof typeof gradients;

type BlobProps = {
  preset?: BlobPreset;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
};

export default function Blob({
  preset = "purpleCloud",
  style,
  opacity = 0.9,
}: BlobProps) {
  const { colors, locations } = gradients[preset];

  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      style={[{ position: "absolute", opacity }, style]}
    />
  );
}
