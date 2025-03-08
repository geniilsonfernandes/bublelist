import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";

type IconProps = {
  name: keyof typeof Feather.glyphMap;
  size?: number;
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
};
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  colorName = "text.2",
}) => {
  const iconColor = useThemeColor({}, colorName);
  return <Feather name={name} size={size} color={iconColor} />;
};
