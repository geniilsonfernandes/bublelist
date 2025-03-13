import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outline" | "solid" | "danger";
  cap?: "top" | "bottom" | "none";
  onPress?: () => void;
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  onPress,
  style,
  cap = "bottom",
  fullWidth,
  isLoading,
}) => {
  const backgroundColor = useThemeColor({}, "primary.100");
  const borderColor = useThemeColor({}, "background.2");
  const borderSolid = useThemeColor({}, "primary.200");

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    variant === "outline" && { borderColor, ...styles.outline },
    variant === "solid" && {
      backgroundColor,
      borderWidth: 1,
      borderColor: borderSolid,
      borderBottomWidth: 0,
    },
    variant === "danger" && {
      backgroundColor: "#F2334C",
      borderWidth: 1,
      borderColor: "#E46C85",
      borderBottomWidth: 0,
    },
  ];

  return (
    <Pressable
      style={(state) => {
        return [
          containerStyle,
          style,
          state.pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          cap === "bottom" && styles.capBottom,
          cap === "top" && styles.capTop,
          fullWidth && { flex: 1 },
        ];
      }}
      accessibilityRole="button"
      onPress={onPress}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color="#fff"
          style={{ position: "absolute" }}
        />
      ) : (
        <ThemedText colorName={variant === "solid" ? "gray.100" : "text.2"}>
          {children}
        </ThemedText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  capBottom: {
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
  },
  capTop: {
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
  },
});
