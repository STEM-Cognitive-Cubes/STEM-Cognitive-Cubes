import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";
import SessionItemComponent from "../components/SessionItem";
import { recentSessions } from "../config/historyData";
type SessionHistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SessionHistory">;
};
export default function SessionHistoryScreen({
  navigation,
}: SessionHistoryScreenProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {recentSessions.map((session) => (
          <SessionItemComponent
            key={session.id}
            title={session.title}
            date={session.date}
            time={session.time}
            duration={session.duration}
            dotColor={session.dotColor}
            onPress={() =>
              navigation.navigate("SessionDetail", { sessionId: session.id })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F0FF",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
