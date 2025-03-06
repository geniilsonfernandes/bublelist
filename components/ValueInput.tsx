import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import CurrencyInput from "react-native-currency-input";

import { ThemedView } from "./ui/ThemedView";

type ValueInputProps = {
  value: number | null;
  onChangeValue: (value: number | null) => void;
  controlButtons?: boolean;
};

export const ValueInput: React.FC<ValueInputProps> = ({
  onChangeValue,
  value,
  controlButtons,
}) => {
  const iconColor = useThemeColor({}, "text.3");
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView borderColor="background.2" style={styles.input}>
      <Feather name="dollar-sign" size={18} color={iconColor} />
      <CurrencyInput
        placeholder="0,00"
        style={{
          flex: 1,
          color: textColor,
          fontSize: 16,
          height: 48,
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
      {controlButtons ? (
        <View style={styles.budgetButtonContainer}>
          <Pressable
            style={styles.budgetButton}
            // onPress={() => handleBudgetChange(false)}
          >
            <Feather name="minus" size={16} color="#121212" />
          </Pressable>
          <Pressable
            style={styles.budgetButton}
            // onPress={() => handleBudgetChange(true)}
          >
            <Feather name="plus" size={16} color="#121212" />
          </Pressable>
        </View>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  budgetButtonContainer: { flexDirection: "row", gap: 8 },
  budgetButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
