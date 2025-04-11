import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  ViewStyle,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";
import { ThemedView } from "./ThemedView";

type InputSize = "sm" | "md" | "lg" | "xl";

type InputProps = {
  onActionClick?: () => void;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightSection?: React.ReactNode;
  iconName?: keyof typeof Feather.glyphMap;
  showActions?: boolean;
  bg?: themeColors;
  fullWidth?: boolean;
  size?: InputSize;
  pl?: number;
} & TextInputProps;

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      onActionClick,
      rightSection,
      iconName = "check",
      showActions = true,
      bg = "background",
      fullWidth,
      size = "xl",
      leftIcon,
      pl,
      ...rest
    },
    ref
  ) => {
    const textColor = useThemeColor({}, "text.2");
    const backgroundColor = useThemeColor({}, bg);
    const placeholderTextColor = useThemeColor({}, "text.4");
    const iconColor = useThemeColor({}, "gray.100");

    const sizeStyles: Record<InputSize, ViewStyle> = {
      sm: { height: 32 },
      md: { height: 40 },
      lg: { height: 48 },
      xl: { height: 56 },
    };

    return (
      <ThemedView
        style={[
          styles.container,
          { backgroundColor, flex: fullWidth ? 1 : undefined, paddingLeft: pl },
          sizeStyles[size],
        ]}
      >
        {leftIcon && (
          <Feather
            style={{ marginLeft: 8 }}
            name={leftIcon}
            size={16}
            color={textColor}
          />
        )}

        <TextInput
          ref={ref}
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={placeholderTextColor}
          {...rest}
        />

        {rightSection}

        {showActions && rest.value && (
          <Animated.View entering={FadeInLeft} exiting={FadeOutLeft}>
            <Pressable
              onPress={onActionClick}
              style={({ pressed }) => [
                styles.icon,
                { backgroundColor: iconColor, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name={iconName} size={16} color="#000" />
            </Pressable>
          </Animated.View>
        )}
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
