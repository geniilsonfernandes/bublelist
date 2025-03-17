import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
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
  cap?: "top" | "bottom";
};

export const ValueInput: React.FC<ValueInputProps> = ({
  onChangeValue,
  value,
  controlButtons,
  placeholder = "0,00",
  rightLabel = "",
  increment = 50,
  style,
  cap,
}) => {
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

  return (
    <ThemedView style={[styles.container, style]}>
      <Feather name="dollar-sign" size={18} color={textColor} />
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
          <Pressable
            style={styles.budgetButton}
            onPress={() => handleDecrement()}
          >
            <Feather name="minus" size={16} color={textColor} />
          </Pressable>
          <Pressable
            style={styles.budgetButton}
            onPress={() => handleIncrement()}
          >
            <Feather name="plus" size={16} color={textColor} />
          </Pressable>
        </View>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 48,
    paddingHorizontal: 16,
    height: 48,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
  },
  budgetButton: {
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
