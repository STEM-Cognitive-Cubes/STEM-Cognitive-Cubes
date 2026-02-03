import { Image, StyleSheet, View } from "react-native";

import { authBackground } from "../config/authBackground";

type BlobPreset = {
  width: number;
  height: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  rotate: string;
};

export default function AuthBackground() {
  const { lightBlob, darkBlob, dots } = authBackground;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={require("../../../assets/blobs/blob-light.png")}
        style={[styles.blobBase, toBlobStyle(lightBlob)]}
        resizeMode="contain"
      />
      <Image
        source={require("../../../assets/blobs/blob-dark.png")}
        style={[styles.blobBase, toBlobStyle(darkBlob)]}
        resizeMode="contain"
      />
      {dots.map((dot, index) => (
        <Image
          key={`${dot.top}-${dot.left}-${index}`}
          source={require("../../../assets/dots/dot.png")}
          style={[
            styles.dot,
            {
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
              opacity: dot.opacity,
            },
          ]}
          resizeMode="contain"
        />
      ))}
    </View>
  );
}

function toBlobStyle(preset: BlobPreset) {
  return {
    width: preset.width,
    height: preset.height,
    top: preset.top,
    left: preset.left,
    right: preset.right,
    bottom: preset.bottom,
    transform: [{ rotate: preset.rotate }],
  };
}

const styles = StyleSheet.create({
  blobBase: {
    position: "absolute",
  },
  dot: {
    position: "absolute",
  },
});
