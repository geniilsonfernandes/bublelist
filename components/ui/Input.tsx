import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { forwardRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeInLeft, FadeOutLeft } from "react-native-reanimated";

type InputProps = {
  onActionClick?: () => void;
  rightSection?: React.ReactNode;
  iconName?: keyof typeof Feather.glyphMap;
  showActions?: boolean;
  bg?: themeColors;
  fullWidth?: boolean;
  cap?: "top" | "bottom";
  size?: "md" | "lg" | "sm" | "xl";
} & TextInputProps;

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      onActionClick,
      rightSection,
      iconName = "check",
      showActions = true,
      bg = "background",
      cap,
      fullWidth,
      size = "xl",
      ...rest
    },
    ref
  ) => {
    const textColor = useThemeColor({}, "text.2");
    const backgroundColor = useThemeColor({}, bg);
    const placeholderTextColor = useThemeColor({}, "text.3");
    const iconColor = useThemeColor({}, "primary.100");

    const sizeStyles: StyleProp<ViewStyle> = [
      size === "sm" && { height: 32 },
      size === "md" && { height: 40 },
      size === "lg" && { height: 48 },
      size === "xl" && { height: 56 },
    ];
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor,
            flex: fullWidth ? 1 : undefined,
          },
          sizeStyles,
        ]}
      >
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              color: textColor,
            },
          ]}
          placeholderTextColor={placeholderTextColor + "80"}
          {...rest}
        />

        {rest.value && showActions && (
          <Animated.View
            entering={FadeInLeft.duration(200)}
            exiting={FadeOutLeft.duration(200)} // Aqui está a correção
          >
            <Pressable
              onPress={onActionClick}
              style={[
                styles.icon,
                {
                  backgroundColor: iconColor,
                },
              ]}
              disabled={!rest.value}
            >
              <Feather name={iconName} size={16} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    height: 56,
    backgroundColor: "#5B5B5B",
    paddingHorizontal: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
    padding: 8,
    borderRadius: 50,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
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
