import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet } from "react-native";
import CurrencyInput from "react-native-currency-input";

import { ThemedView } from "./ThemedView";

type ValueInputProps = {
  value: number | null;
  onChangeValue: (value: number | null) => void;
};

export const ValueInput: React.FC<ValueInputProps> = ({
  onChangeValue,
  value,
}) => {
  const iconColor = useThemeColor({}, "text.3");
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView
      backgroundColor="background.1"
      borderColor="background.2"
      style={styles.input}
    >
      <Feather name="dollar-sign" size={18} color={iconColor} />
      <CurrencyInput
        placeholder="0,00"
        style={{
          flex: 1,
          color: textColor,
          fontSize: 16,
        }}
        keyboardType="numeric"
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="none"
        autoComplete="off"
        value={value}
        onChangeValue={onChangeValue}

        // {...props}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
});
