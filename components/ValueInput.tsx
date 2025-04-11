import { themeColors, useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import CurrencyInput from "react-native-currency-input";

import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

type ValueInputProps = {
  value: number | null;
  onChangeValue: (value: number | null) => void;
  controlButtons?: boolean;
  placeholder?: string;
  rightLabel?: string;
  increment?: number;
  style?: StyleProp<ViewStyle>;
  bg?: themeColors;
  size?: "md" | "lg" | "sm";
  pl?: number;
};

export const ValueInput: React.FC<ValueInputProps> = ({
  onChangeValue,
  value,
  controlButtons,
  placeholder = "0,00",
  rightLabel = "",
  increment = 50,
  size,
  style,
  pl,
  bg = "background",
}) => {
  const backgroundColor = useThemeColor({}, bg);
  const textColor = useThemeColor({}, "text.2");

  const handleIncrement = () => {
    const prev = value || 0;
    onChangeValue(prev + increment);
  };

  const handleDecrement = () => {
    const prev = value || 0;
    if (prev <= increment) return;
    onChangeValue(prev - increment);
  };

  const height = {
    sm: 42,
    md: 56,
    lg: 64,
  } as Record<"sm" | "md" | "lg", number>;

  return (
    <ThemedView
      style={[
        styles.container,
        style,
        { backgroundColor, height: height[size || "md"], paddingLeft: pl },
      ]}
    >
      <CurrencyInput
        placeholder={placeholder}
        placeholderTextColor={textColor}
        keyboardType="numeric"
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="none"
        autoComplete="off"
        value={value}
        maxLength={6}
        style={{ flex: 1, color: textColor, fontSize: 16 }}
        onChangeValue={onChangeValue}
        // {...props}
      />
      <ThemedText
        colorName="text.6"
        style={{ fontSize: 14, position: "absolute", right: 16 }}
      >
        {rightLabel}
      </ThemedText>
      {controlButtons ? (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.budgetButton}
            onPress={() => handleDecrement()}
          >
            <Feather name="minus" size={16} color={textColor} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.budgetButton}
            onPress={() => handleIncrement()}
          >
            <Feather name="plus" size={16} color={textColor} />
          </TouchableOpacity>
        </View>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 56,
  },
  controls: {
    flexDirection: "row",
    gap: 10,
  },
  budgetButton: {
    width: 40,
    height: 40,

    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
