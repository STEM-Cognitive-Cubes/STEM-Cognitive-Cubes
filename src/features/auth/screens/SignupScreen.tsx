import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";
import AuthBackground from "../components/AuthBackground";
import AuthTextInput from "../components/AuthTextInput";

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <AuthBackground />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Start your smart building journey.
        </Text>

        <Text style={styles.sectionTitle}>PARENT DETAILS</Text>
        <AuthTextInput
          placeholder="Full Name"
          leftElement={<Feather name="user" size={16} color="black" />}
        />
        <AuthTextInput
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          leftElement={<Feather name="mail" size={16} color="black" />}
        />
        <AuthTextInput
          placeholder="Password"
          secureTextEntry
          leftElement={<Feather name="lock" size={16} color="black" />}
        />
        <AuthTextInput
          placeholder="Confirm password"
          secureTextEntry
          leftElement={<Feather name="lock" size={16} color="black" />}
        />

        <View style={styles.button}>
          <Text style={styles.buttonText}>Sign up</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  title: {
    color: "black",
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    marginBottom: 8,
  },
  subtitle: {
    color: "black",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "black",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
    backgroundColor: colors.lightYellow,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
});
