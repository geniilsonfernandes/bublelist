import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import { Pressable, View } from "react-native";
import { Icon } from "./Icon";
import { ThemedText } from "./ThemedText";

type IconButtonWithLabelProps = {
  icon: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap | "none";
  variant?: "solid" | "ghost";
  label: string;
  onPress?: () => void;
};
export const IconButtonWithLabel: React.FC<IconButtonWithLabelProps> = ({
  icon = "trash-2",
  label,
  rightIcon = "chevron-right",
  onPress,
  variant = "solid",
}) => {
  const backgroundColor = useThemeColor({}, "background.1");

  const variantStyles = {
    solid: {
      backgroundColor: backgroundColor,

      borderBottomWidth: 0,
    },
    ghost: {
      backgroundColor: "transparent",
    },
  };

  return (
    <View
      style={[{ borderRadius: 16, overflow: "hidden" }, variantStyles[variant]]}
    >
      <Pressable
        onPress={onPress}
        android_ripple={{
          color: "#E6E6E610",
          foreground: true,
        }}
        style={{
          flexDirection: "row",
          padding: 16,
          paddingHorizontal: 18,
          gap: 16,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Icon name={icon} size={18} />
        <ThemedText type="defaultSemiBold" style={{ flex: 1 }}>
          {label}
        </ThemedText>
        {rightIcon === "none" ? null : <Icon name={rightIcon} size={18} />}
      </Pressable>
    </View>
  );
};
