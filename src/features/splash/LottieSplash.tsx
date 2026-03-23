import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

type Props = {
  onFinish?: () => void;
};

export function LottieSplash({ onFinish }: Props) {
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
});
