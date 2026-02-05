import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";
import AuthBackground from "../components/AuthBackground";
import AuthTextInput from "../components/AuthTextInput";
import { auth } from "../../../services/firebase";
import AuthSuccessModal from "../components/AuthSuccessModal";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../navigation/types";

type SignupScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Signup">;
};

export default function SignupScreen({ navigation }: SignupScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleSignup = async () => {
    setAuthError("");
    if (!email.trim() || !password) {
      setAuthError("Please enter email and password.");
      return;
    }
    if (password !== confirmPassword) {
      setAuthError("Passwords do not match.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setIsSuccessOpen(true);
    } catch (error) {
      setAuthError("Sign up failed. Try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      try {
        await GoogleSignin.signOut();
      } catch {
        // Ignore Google sign-out errors for now.
      }
    } finally {
      navigation.navigate("Login");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <AuthBackground />
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start your smart building journey.
          </Text>

          <Text style={styles.sectionTitle}>PARENT DETAILS</Text>
          <AuthTextInput
            placeholder="Full Name"
            leftElement={<Feather name="user" size={16} color="black" />}
            value={fullName}
            onChangeText={setFullName}
          />
          <AuthTextInput
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            leftElement={<Feather name="mail" size={16} color="black" />}
            value={email}
            onChangeText={setEmail}
          />
          <AuthTextInput
            placeholder="Password"
            secureTextEntry
            leftElement={<Feather name="lock" size={16} color="black" />}
            value={password}
            onChangeText={setPassword}
          />
          <AuthTextInput
            placeholder="Confirm password"
            secureTextEntry
            leftElement={<Feather name="lock" size={16} color="black" />}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
          <Pressable style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </Pressable>
        </ScrollView>
      </View>
      {isSuccessOpen ? (
        <AuthSuccessModal
          title="Welcome to BlokC!"
          message="Your account has been successfully created. You can now log in and start tracking progress."
          buttonText="Continue to login"
          onAction={() => {
            setIsSuccessOpen(false);
            navigation.navigate("Login");
          }}
          onClose={() => setIsSuccessOpen(false)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.purple,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
  },
  title: {
    color: "black",
    fontSize: 26,
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
  logoutButton: {
    marginTop: 16,
    backgroundColor: "transparent",
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
  logoutButtonText: {
    color: "black",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  errorText: {
    color: "#B00020",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    marginBottom: 8,
  },
});
