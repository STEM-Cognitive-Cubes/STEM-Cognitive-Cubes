import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";
import AuthTextInput from "./AuthTextInput";

type ForgotPasswordModalProps = {
  onClose: () => void;
};

export default function ForgotPasswordModal({
  onClose,
}: ForgotPasswordModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Feather name="arrow-left" size={18} color="black" />
        </Pressable>

        <View style={styles.iconCircle}>
          <Feather name="mail" size={22} color="black" />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Don't worry! It happens. Please enter the email associated with your
          account.
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <AuthTextInput
          placeholder="Enter your email"
          style={styles.emailInput}
        />

        <View style={styles.button}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  iconCircle: {
    alignSelf: "center",
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(80,100,172,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  title: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
    color: "rgba(0,0,0,0.6)",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    marginBottom: 14,
  },
  label: {
    color: "black",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 6,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.blue,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
});
