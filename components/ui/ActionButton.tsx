import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ActionButtonProps = {
  style?: StyleProp<ViewStyle>;
  variant?: "outline" | "solid" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
} & PressableProps;

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  variant = "ghost",
  style,
  size = "md",
  ...props
}) => {
  const backgroundColor = useThemeColor({}, "background.1");
  const borderColor = useThemeColor({}, "background.1");

  const sizeStyles: StyleProp<ViewStyle> = [
    size === "sm" && { height: 32 },
    size === "md" && { height: 40 },
    size === "lg" && { height: 48 },
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
