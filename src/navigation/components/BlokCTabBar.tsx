import React from "react";
import { View, Pressable, StyleSheet, Text } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const PURPLE = "#6D5AAE"; // bar color
const WHITE = "#FFFFFF";
const ICON = "#0B0B0B";

function getIcon(routeName: string, focused: boolean) {
  // Match your screenshot vibe: simple black icons.
  // You can swap icons later.
  switch (routeName) {
    case "Home":
      return <Ionicons name="home" size={24} color={ICON} />;
    case "History":
      return <Feather name="refresh-ccw" size={24} color={ICON} />;
    case "Settings":
      return <Feather name="settings" size={24} color={ICON} />;
    case "Insights":
      return <Feather name="bar-chart-2" size={24} color={ICON} />;
    case "Profile":
      return <Feather name="user" size={24} color={ICON} />;
    default:
      return <Feather name="circle" size={24} color={ICON} />;
  }
}

export default function BlokCTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrap}>
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const onLongPress = () => navigation.emit({ type: "tabLongPress", target: route.key });

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.item}
              android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: true }}
            >
              {/* The “bump” circle for the active tab (Home or any focused tab) */}
              {focused && (
                <View style={styles.bumpWrap}>
                  <View style={styles.bumpCircle} />
                </View>
              )}

              <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
                {getIcon(route.name, focused)}
              </View>

              {/* Only show label for focused tab (like your screenshot shows Home text) */}
              {focused ? <Text style={styles.label}>{route.name}</Text> : <View style={{ height: 16 }} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#FFFFFF",
  },

  bar: {
    flexDirection: "row",
    backgroundColor: PURPLE,
    paddingTop: 14,
    paddingHorizontal: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    alignItems: "flex-end",
  },

  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    minHeight: 58,
  },

  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  iconWrapFocused: {
    // keeps the icon centered inside the bump
    marginTop: -14,
  },

  bumpWrap: {
    position: "absolute",
    top: -18,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },

  bumpCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PURPLE,
    borderWidth: 6,
    borderColor: WHITE,

    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  label: {
    marginTop: 6,
    color: WHITE,
    fontWeight: "800",
    fontSize: 12,
  },
});
