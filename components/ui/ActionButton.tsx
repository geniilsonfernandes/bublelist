import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

export type ActionButtonProps = {
  style?: StyleProp<ViewStyle>;
  variant?: "outline" | "solid" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl" | "xxl" | "large";

  bg?: themeColors;
} & PressableProps;

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "ghost",
  style,
  size = "md",
  bg = "background.1",
  ...props
}) => {
  const backgroundColor = useThemeColor({}, bg);
  const borderColor = useThemeColor({}, bg);

  const sizeStyles: StyleProp<ViewStyle> = [
    size === "sm" && { height: 32 },
    size === "md" && { height: 40 },
    size === "lg" && { height: 48 },
    size === "xl" && { height: 56, width: 56 },
    size === "xxl" && { height: 64, width: 64 },
    size === "large" && { height: 72, width: 72 },
  ];

  const variantStyles: StyleProp<ViewStyle> = [
    variant === "outline" && {
      borderWidth: 1,
      borderColor,
    },
    variant === "danger" && { backgroundColor: "#FF0000" },
    variant === "solid" && { backgroundColor },
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          ...styles.actionButton,
          opacity: pressed ? 0.5 : 1,

          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        variantStyles,
        sizeStyles,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
