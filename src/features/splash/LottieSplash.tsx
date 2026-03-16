import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Easing } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  onFinish?: () => void;
};

export function LottieSplash({ onFinish }: Props) {
  const translateX = useRef(new Animated.Value(60)).current; // start from right
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../../assets/lottie/splash.json")}
        autoPlay
        loop={false}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        onAnimationFinish={() => onFinish?.()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#B860FF" },

  textWrap: {
    position: "absolute",
    bottom: 110,
    left: 24,
    right: 24,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "white",
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
  },
});