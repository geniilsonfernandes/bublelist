import { ThemedText } from "@/components/ui/ThemedText";
import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import {
    Pressable,
    StyleProp,
    View,
    ViewStyle
} from "react-native";

type SettingsButtonProps = {
  label: string | React.ReactNode;
  rightComponent?: React.ReactNode;
  pr?: number;
  onPress?: () => void;
  color?: themeColors;
  bg?: themeColors;
};

export const SettingsButton: React.FC<SettingsButtonProps> = ({
  label,
  rightComponent,
  pr,
  onPress,
  bg = "background.1",
  color,
}) => {
  const backgroundColor = useThemeColor({}, bg);
  const styles: StyleProp<ViewStyle> = {
    paddingRight: pr,
  };

  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          padding: 16,
          height: 56,
          borderRadius: 8,
          backgroundColor,
        },
        styles,
      ]}
      onPress={onPress}
      // bg="background.1"
    >
      <ThemedText type="defaultSemiBold" colorName={color}>
        {label}
      </ThemedText>
      {rightComponent}
    </Comp>
  );
};
