import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";

type IconProps = {
  name: keyof typeof Feather.glyphMap;
  size?: number;
};
export const Icon: React.FC<IconProps> = ({ name, size = 24 }) => {
  const iconColor = useThemeColor({}, "text.2");
  return <Feather name={name} size={size} color={iconColor} />;
};
