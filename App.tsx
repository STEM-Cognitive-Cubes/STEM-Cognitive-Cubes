import React, { useState } from "react";
import { View, Text } from "react-native";
import { LottieSplash } from "./src/features/splash/LottieSplash";

export default function App() {
  const [done, setDone] = useState(false);

  if (!done) return <LottieSplash onFinish={() => setDone(true)} />;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Main App</Text>
    </View>
  );
}
