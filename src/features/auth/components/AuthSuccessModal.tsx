import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";

type AuthSuccessModalProps = {
  title: string;
  message: string;
  buttonText?: string;
  onClose?: () => void;
  onAction?: () => void;
};

export default function AuthSuccessModal({
  title,
  message,
  buttonText,
  onClose,
  onAction,
}: AuthSuccessModalProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {onClose ? (
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Feather name="arrow-left" size={18} color="black" />
          </Pressable>
        ) : null}

        <View style={styles.iconCircle}>
          <Feather name="check" size={22} color="#1DBE5F" />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>

        {buttonText ? (
          <Pressable style={styles.button} onPress={onAction}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </Pressable>
        ) : null}
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
    borderRadius: 24,
    borderWidth: 3,
    borderColor: "#1DBE5F",
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
  button: {
    marginTop: 6,
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
});
