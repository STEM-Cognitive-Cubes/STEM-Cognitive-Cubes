import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import type { ReactNode } from "react";

import { colors } from "../../../config/theme";
import { fontFamilies } from "../../../config/typography";

type AuthTextInputProps = TextInputProps & {
  label?: string;
  leftElement?: ReactNode;
  rightText?: string;
  rightElement?: ReactNode;
  onRightPress?: () => void;
};

export default function AuthTextInput({
  label,
  leftElement,
  rightText,
  rightElement,
  onRightPress,
  style,
  ...props
}: AuthTextInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          placeholderTextColor="rgba(0,0,0,0.45)"
          style={[
            styles.input,
            leftElement ? styles.inputWithLeft : null,
            style,
          ]}
          {...props}
        />
        {leftElement ? (
          <View style={styles.leftAction}>{leftElement}</View>
        ) : null}
        {rightText || rightElement ? (
          <Pressable onPress={onRightPress} style={styles.rightAction}>
            {rightElement ?? <Text style={styles.rightText}>{rightText}</Text>}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "black",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  inputContainer: {
    position: "relative",
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "black",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
  },
  inputWithLeft: {
    paddingLeft: 44,
  },
  leftAction: {
    position: "absolute",
    left: 16,
    height: "100%",
    justifyContent: "center",
  },
  rightAction: {
    position: "absolute",
    right: 16,
    height: "100%",
    justifyContent: "center",
  },
  rightText: {
    color: "black",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
  },
});
