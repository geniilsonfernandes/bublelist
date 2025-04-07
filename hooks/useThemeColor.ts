/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export type themeColors =
  | (keyof typeof Colors.light & keyof typeof Colors.dark)
  | "transparent";

export function useThemeColor(
  props: { light?: string; dark?: string } = {},
  colorName: themeColors
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorName === "transparent") {
    return "transparent";
  }

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
