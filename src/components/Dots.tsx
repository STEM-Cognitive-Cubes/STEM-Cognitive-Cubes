import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { dots as dotTokens } from "../config/theme";

type DotPosition = {
  top: number;
  left: number;
};

type DotsProps = {
  positions: DotPosition[];
  size?: number;
  color?: string;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Dots({
  positions,
  size = dotTokens.size,
  color = dotTokens.color,
  opacity = 1,
  style,
}: DotsProps) {
  return (
    <View style={[{ position: "absolute", opacity }, style]}>
      {positions.map((pos, index) => (
        <View
          key={`${pos.left}-${pos.top}-${index}`}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            top: pos.top,
            left: pos.left,
          }}
        />
      ))}
    </View>
  );
}
