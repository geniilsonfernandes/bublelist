import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;

  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "body"
    | "title.2"
    | "title.3";
  colorName?: keyof typeof Colors.light;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorName = "text",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName
  );

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "title.2" ? styles["title.2"] : undefined,
        type === "title.3" ? styles["title.3"] : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "body" ? styles.body : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  "title.2": {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  "title.3": {
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  body: {
    fontSize: 14,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
