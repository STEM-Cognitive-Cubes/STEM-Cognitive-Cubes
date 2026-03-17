import { Image, Pressable, StyleSheet, Text, View, Alert } from "react-native";
import { useEffect, useState } from "react";
import { Feather, FontAwesome } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";
import AuthBackground from "../components/AuthBackground";
import AuthTextInput from "../components/AuthTextInput";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import type { RootStackParamList } from "../../../navigation/types";
import { auth, db } from "../../../services/firebase";
import AuthSuccessModal from "../components/AuthSuccessModal";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseAuthErrors";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [googleName, setGoogleName] = useState<string | null>(null);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "897405902939-n2u19hv6777iuphnsose5dj27ukjbv1c.apps.googleusercontent.com",
      scopes: ["profile", "email", "openid"],
    });
  }, []);
  useEffect(() => {
  if (!isLoginSuccess) {
    return;
  }

  const timer = setTimeout(() => {
    setIsLoginSuccess(false);
    navigation.replace("MainTabs");
  }, 1500); // delay to show home screen after success modal

  return () => clearTimeout(timer);
}, [isLoginSuccess, navigation]);

  const handleLogin = async () => {
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setIsLoginSuccess(true);
    } catch (error) {
      setAuthError(
        getFirebaseAuthErrorMessage(
          error,
          "Login failed. Check your email and password."
        )
      );
      // Keep a console trail for debugging (device logs / Metro).
      // eslint-disable-next-line no-console
      console.warn("Email login failed:", error);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("handleGoogleLogin pressed");
    setAuthError("");
    try {
      console.log("Checking play services");
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      try {
        await GoogleSignin.signOut();
      } catch (e) {
        // Safe to ignore if they weren't signed in initially
      }
      console.log("Calling signIn");
      const userInfo = (await GoogleSignin.signIn()) as unknown as {
        idToken?: string | null;
        user?: { name?: string | null; email?: string | null } | null;
      };
      console.log("signIn completed:", !!userInfo);
      const tokens = await GoogleSignin.getTokens();
      const idToken = userInfo.idToken ?? tokens.idToken;
      if (!idToken) {
        setAuthError("Google sign-in failed. Missing token.");
        return;
      }
      
      const emailToCheck = userInfo.user?.email ?? "";
      if (emailToCheck) {
        const methods = await fetchSignInMethodsForEmail(auth, emailToCheck);
        if (methods.includes("password")) {
          setAuthError("An account already exists using email/password. Please log in with your password.");
          await GoogleSignin.signOut();
          return;
        }
      }

      const credential = GoogleAuthProvider.credential(idToken);
      console.log("signInWithCredential...");
      const result = await signInWithCredential(auth, credential);
      console.log("signInWithCredential completed. UID:", result.user.uid);
      const name = result.user.displayName ?? userInfo.user?.name ?? "User";
      console.log("Saving to Firestore...");
      setDoc(doc(db, "parents", result.user.uid), {
        fullName: name,
        email: result.user.email ?? userInfo.user?.email ?? "",
        updatedAt: new Date().toISOString()
      }, { merge: true })
      .then(() => console.log("Saved to Firestore!"))
      .catch((e) => console.error("Firestore save failed:", e));
      
      setGoogleName(name);
      setIsLoginSuccess(true);
    } catch (rawError) {
      console.error("GOOGLE LOGIN ERROR:", rawError);
      const error = rawError as { code?: string; message?: string } | undefined;
      
      if (error?.code !== statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Google Login Error", `Code: ${error?.code} Msg: ${error?.message || String(rawError)}`);
      }

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }
      if (error?.code === statusCodes.IN_PROGRESS) {
        setAuthError("Google sign-in already in progress.");
        return;
      }
      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setAuthError("Google Play Services unavailable.");
        return;
      }
      const errorMessage =
        error?.message ?? (typeof error === "string" ? error : "Unknown error");
      setAuthError(`Google sign-in failed: ${error?.code ?? ""} ${errorMessage}`.trim());
    }
  };

  return (
    <>
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
          value={email}
          onChangeText={setEmail}
        />

          <AuthTextInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={isPasswordHidden}
          value={password}
          onChangeText={setPassword}
          rightElement={
            <Feather
              name={isPasswordHidden ? "eye" : "eye-off"}
              size={18}
              color="black"
            />
          }
          onRightPress={() => setIsPasswordHidden((prev) => !prev)}
        />

          <Pressable
            style={styles.forgotButton}
            onPress={() => setIsForgotOpen(true)}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

        {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or Login with Google</Text>
            <View style={styles.dividerLine} />
          </View>

        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <View style={styles.googleIcon}>
            <FontAwesome name="google" size={14} color="black" />
          </View>
          <Text style={styles.googleButtonText}>Login with Google</Text>
        </Pressable>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Not registered yet? </Text>
            <Pressable onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </View>
        </View>
      </View>
      {isForgotOpen ? (
        <ForgotPasswordModal onClose={() => setIsForgotOpen(false)} />
      ) : null}
      {isLoginSuccess ? (
        <AuthSuccessModal
          title={googleName ? `Welcome Back, ${googleName}!` : "Welcome Back!"}
          message="Successfully signed in."
          onClose={() => setIsLoginSuccess(false)}
        />
      ) : null}
    </>
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
  errorText: {
    color: "#B00020",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.lightYellow,
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryButtonText: {
    color: "black",
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
    backgroundColor: colors.lightYellow,
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
  googleButtonText: {
    color: "black",
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
