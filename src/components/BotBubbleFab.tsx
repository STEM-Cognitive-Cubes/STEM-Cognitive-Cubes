import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  onPress: () => void;
  size?: number; // orb size
};

export default function BotBubbleFab({ onPress, size = 64 }: Props) {
  const floatY = useRef(new Animated.Value(0)).current;
  const mistA = useRef(new Animated.Value(0)).current;
  const mistB = useRef(new Animated.Value(0)).current;

  const blink = useRef(new Animated.Value(1)).current; // 1=open, ~0=closed
  const blinkTimer = useRef<number | null>(null);

  const s = useMemo(() => makeStyles(size), [size]);

  useEffect(() => {
    // gentle floating
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -6, duration: 1200, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    // mist rotation / drift (two layers, different speeds)
    Animated.loop(
      Animated.timing(mistA, { toValue: 1, duration: 2600, useNativeDriver: true })
    ).start();
    Animated.loop(
      Animated.timing(mistB, { toValue: 1, duration: 3600, useNativeDriver: true })
    ).start();

    // random-ish blinking (simple: schedule a blink, reschedule)
    const scheduleBlink = () => {
      const delay = 1800 + Math.floor(Math.random() * 2200); // 1.8s–4s
      blinkTimer.current = setTimeout(() => {
        Animated.sequence([
          Animated.timing(blink, { toValue: 0.12, duration: 90, useNativeDriver: true }),
          Animated.timing(blink, { toValue: 1, duration: 120, useNativeDriver: true }),
        ]).start(() => scheduleBlink());
      }, delay) as unknown as number;
    };
    scheduleBlink();

    return () => {
      if (blinkTimer.current) clearTimeout(blinkTimer.current);
    };
  }, [floatY, mistA, mistB, blink]);

  // mist transforms
  const mistARotate = mistA.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  const mistBRotate = mistB.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <Animated.View style={[s.fabWrap, { transform: [{ translateY: floatY }] }]}>
      <Pressable onPress={onPress} style={s.hit}>
        <View style={s.orb}>
          {/* Outer glass gradient */}
          <LinearGradient
            colors={["rgba(255,255,255,0.35)", "rgba(255,255,255,0.08)", "rgba(0,0,0,0.10)"]}
            start={{ x: 0.15, y: 0.05 }}
            end={{ x: 0.9, y: 1 }}
            style={s.glass}
          />

          {/* Your purple energy core */}
          <LinearGradient
            colors={["#B860FF", "#7A4DFF", "#2A1C66"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.9, y: 0.9 }}
            style={s.core}
          />

          {/* Mist layer A */}
          <Animated.View style={[s.mist, { transform: [{ rotate: mistARotate }] }]}>
            <LinearGradient
              colors={["rgba(255,255,255,0.0)", "rgba(255,255,255,0.26)", "rgba(255,255,255,0.0)"]}
              start={{ x: 0.1, y: 0.2 }}
              end={{ x: 0.9, y: 0.8 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Mist layer B */}
          <Animated.View style={[s.mist, s.mistB, { transform: [{ rotate: mistBRotate }] }]}>
            <LinearGradient
              colors={["rgba(255,255,255,0.0)", "rgba(190,160,255,0.22)", "rgba(255,255,255,0.0)"]}
              start={{ x: 0.8, y: 0.2 }}
              end={{ x: 0.1, y: 0.85 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          {/* Glass highlight */}
          <View style={s.highlight} />

          {/* Eyes (blink by scaling Y) */}
          <Animated.View style={[s.eyesRow, { transform: [{ scaleY: blink }] }]}>
            <View style={s.eye} />
            <View style={s.eye} />
          </Animated.View>

          {/* Subtle outer shadow ring */}
          <View style={s.ring} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

function makeStyles(size: number) {
  const r = size / 2;

  return StyleSheet.create({
    fabWrap: {
      position: "absolute",
      right: 18,
      bottom: 110, // keep above your bottom nav; adjust 90–130 if needed
      zIndex: 999,
    },

    hit: {
      width: size + 14,
      height: size + 14,
      alignItems: "center",
      justifyContent: "center",
    },

    orb: {
      width: size,
      height: size,
      borderRadius: r,
      overflow: "hidden",

      // Shadow (iOS + Android)
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },

    glass: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: r,
    },

    core: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: r,
      opacity: 0.92,
    },

    mist: {
      position: "absolute",
      left: -size * 0.25,
      top: -size * 0.25,
      width: size * 1.5,
      height: size * 1.5,
      borderRadius: size,
      opacity: 0.9,
    },

    mistB: {
      opacity: 0.75,
    },

    highlight: {
      position: "absolute",
      left: size * 0.16,
      top: size * 0.14,
      width: size * 0.46,
      height: size * 0.32,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.22)",
      transform: [{ rotate: "-18deg" }],
    },

    eyesRow: {
      position: "absolute",
      left: 0,
      right: 0,
      top: size * 0.42,
      flexDirection: "row",
      justifyContent: "center",
      gap: size * 0.14,
    },

    eye: {
      width: size * 0.10,
      height: size * 0.18,
      borderRadius: 999,
      backgroundColor: "rgba(235,245,255,0.9)",
      shadowColor: "#FFFFFF",
      shadowOpacity: 0.55,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
    },

    ring: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: r,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.18)",
    },
  });
}
