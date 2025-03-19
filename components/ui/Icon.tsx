import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";

export type IconProps = {
  colorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
} & React.ComponentProps<typeof Feather>;
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  colorName = "text.2",
  ...props
}) => {
  const iconColor = useThemeColor({}, colorName);
  return <Feather name={name} size={size} color={iconColor} {...props} />;
};
