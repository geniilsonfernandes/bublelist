import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type QuantitySelectorProps = {
  quantity: number | null;
  onChangeQuantity: (value: number) => void;
  size?: "sm" | "md" | "lg";
};

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChangeQuantity,
  size = "md",
}) => {
  const backgroundColor = useThemeColor({}, "background.2");
  const color = useThemeColor({}, "text");

  const handleDecrease = () => {
    Haptics.selectionAsync();
    onChangeQuantity(quantity ? quantity - 1 : 0);
  };

  const handleIncrease = () => {
    Haptics.selectionAsync();
    onChangeQuantity(quantity ? quantity + 1 : 1);
  };

  const handleChangeText = (text: string) => {
    const numericValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
    onChangeQuantity(isNaN(numericValue) ? 0 : numericValue);
  };

  const height = {
    sm: 42,
    md: 56,
    lg: 64,
  } as Record<"sm" | "md" | "lg", number>;

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor, height: height[size] },
          pressed && { opacity: 0.5 },
        ]}
        onPress={handleDecrease}
      >
        <Feather name="minus" size={18} color={color} />
      </Pressable>
      <TextInput
        placeholder="quant."
        autoCorrect={false}
        autoCapitalize="none"
        textContentType="none"
        autoComplete="off"
        style={[
          styles.input,
          {
            color,
            backgroundColor,
            height: height[size],
          },
        ]}
        value={String(quantity)}
        onChangeText={handleChangeText}
        keyboardType="numeric"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor, height: height[size] },
          pressed && { opacity: 0.5 },
        ]}
        onPress={handleIncrease}
      >
        <Feather name="plus" size={18} color={color} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  input: {
    fontSize: 16,
    textAlign: "center",

    width: 54,
    height: 48,
    borderRadius: 8,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#5B5B5B",
  },
  capLeft: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  capRight: {
    borderTopRightRadius: 24,
    borderBottomRightRadius: 16,
  },
});
