import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Icon } from "./Icon";
import { ThemedText } from "./ThemedText";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "outline" | "solid" | "danger" | "ghost";
  bg?: themeColors;
  cap?: ("TopStart" | "TopEnd" | "BottomStart" | "BottomEnd")[];
  capRadius?: number;
  onPress?: () => void;
  rightIcon?: keyof typeof Feather.glyphMap;
  leftIcon?: keyof typeof Feather.glyphMap;
  isLoading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "solid",
  onPress,
  style,
  cap = [],
  capRadius = 8,
  leftIcon,
  rightIcon,
  fullWidth,
  isLoading,
  bg = "primary.100",
}) => {
  const backgroundColor = useThemeColor({}, bg);
  const borderColor = useThemeColor({}, "background.2");

  const capStyle: StyleProp<ViewStyle> = cap?.reduce((acc, cur) => {
    switch (cur) {
      case "TopStart":
        return { borderTopStartRadius: capRadius, ...acc };
      case "TopEnd":
        return { borderTopEndRadius: capRadius, ...acc };
      case "BottomStart":
        return { borderBottomStartRadius: capRadius, ...acc };
      case "BottomEnd":
        return { borderBottomEndRadius: capRadius, ...acc };
      default:
        return acc;
    }
  }, {});

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    variant === "outline" && { borderColor, ...styles.outline },
    variant === "solid" && {
      backgroundColor,
    },
    variant === "danger" && {
      backgroundColor: "#F2334C",
      borderWidth: 1,
      borderColor: "#E46C85",
      borderBottomWidth: 0,
    },
    variant === "ghost" && {
      backgroundColor: "transparent",
      borderWidth: 0,
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

          fullWidth && { flex: 1 },
          capStyle,
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          {leftIcon && (
            <Icon
              name={leftIcon || "chevron-right"}
              size={24}
              colorName={variant === "solid" ? "gray.100" : "text.2"}
            />
          )}
          <ThemedText colorName={variant === "solid" ? "gray.100" : "text.2"}>
            {children}
          </ThemedText>

          {rightIcon && (
            <Icon
              name={rightIcon}
              size={24}
              colorName={variant === "solid" ? "gray.100" : "text.2"}
            />
          )}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 8,

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 8,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
});
