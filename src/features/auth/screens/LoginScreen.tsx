import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";
import AuthBackground from "../components/AuthBackground";
import AuthTextInput from "../components/AuthTextInput";

export default function LoginScreen() {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  return (
    <View style={styles.container}>
      <AuthBackground />
      <View style={styles.headerRow}>
        <Image
          source={require("../../../assets/mascot/mascot.png")}
          style={styles.mascot}
          resizeMode="contain"
        />
        <Text style={styles.title}>Hi, Welcome to{"\n"}BlokC</Text>
      </View>

      <View style={styles.form}>
        <AuthTextInput
          label="Email"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthTextInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={isPasswordHidden}
          rightElement={
            <Feather
              name={isPasswordHidden ? "eye" : "eye-off"}
              size={18}
              color="black"
            />
          }
          onRightPress={() => setIsPasswordHidden((prev) => !prev)}
        />

        <Pressable style={styles.forgotButton} onPress={() => {}}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <Pressable style={styles.primaryButton} onPress={() => {}}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or Login with Google</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable style={styles.googleButton} onPress={() => {}}>
          <View style={styles.googleIcon}>
            <Text style={styles.googleIconText}>G</Text>
          </View>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </Pressable>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Not registered yet? </Text>
          <Pressable onPress={() => {}}>
            <Text style={styles.footerLink}>Create an account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    paddingHorizontal: 24,
    paddingTop: 140,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    position: "relative",
    paddingLeft: 150,
    marginBottom: 32,
    marginTop: 80,
  },
  form: {
    marginTop: 190,
  },
  mascot: {
    position: "absolute",
    left: -40,
    top: -160,
    width: 588,
    height: 483,
  },
  title: {
    color: "black",
    fontSize: 32,
    fontFamily: fontFamilies.bold,
    flexShrink: 1,
    flexWrap: "wrap",
    lineHeight: 30,
    marginTop: -130,
    marginLeft: -150,
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotText: {
    color: "black",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  primaryButton: {
    backgroundColor: colors.blue,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    borderRadius: 22,
    paddingVertical: 12,
    marginBottom: 18,
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  googleIconText: {
    fontSize: 12,
    color: colors.blue,
    fontFamily: fontFamilies.semiBold,
  },
  googleButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  footerText: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  footerLink: {
    color: colors.white,
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    textDecorationLine: "underline",
  },
});
