import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "./ThemedText";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outline" | "solid";
  onPress?: () => void;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  onPress,
  style,
}) => {
  const backgroundColor = useThemeColor({}, "primary.200");
  const borderColor = useThemeColor({}, "background.2");

  const containerStyle = [
    styles.container,
    variant === "outline" && { borderColor, ...styles.outline },
    variant === "solid" && { backgroundColor },
  ];

  return (
    <Pressable
      style={(state) => {
        return [containerStyle, style, state.pressed && { opacity: 0.8 }];
      }}
      accessibilityRole="button"
      onPress={onPress}
    >
      <ThemedText colorName={variant === "solid" ? "gray.100" : "text.2"}>
        {children}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 16,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
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
});
