import { View, type ViewProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { themeColors, useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: themeColors;
  backgroundColor?: themeColors;
  bg?: themeColors;
  borderColor?: keyof typeof Colors.light;
};

export function ThemedView({
  style,
  lightColor,
  colorName,
  backgroundColor,
  borderColor,
  bg,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColorValue = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName || backgroundColor || bg || "background"
  );
  const borderColorValue = useThemeColor({}, borderColor ?? "background.1");

  const border = {
    borderWidth: 1,
    borderColor: borderColorValue,
  };

  return (
    <View
      style={[
        { backgroundColor: backgroundColorValue, ...(borderColor && border) },
        style,
      ]}
      {...otherProps}
    />
  );
}
