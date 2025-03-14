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
  const backgroundColor = useThemeColor({}, "background.2");
  const borderColor = useThemeColor({}, "background.4");

  const sizeStyles: StyleProp<ViewStyle> = [
    size === "sm" && { width: 32, height: 32 },
    size === "md" && { width: 40, height: 40 },
    size === "lg" && { width: 48, height: 48 },
  ];


  const variantStyles: StyleProp<ViewStyle> = [
    variant === "outline" && {
      borderWidth: 1,
      borderColor,
    },
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        {
          ...styles.actionButton,

          opacity: pressed ? 0.5 : 1,

          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
        style,
        variantStyles,
        sizeStyles,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
});
