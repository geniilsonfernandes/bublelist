import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { ThemedView } from "./ui/ThemedView";

type QuantitySelectorProps = {
  quantity: number | null;
  onChangeQuantity: (value: number) => void;
};

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChangeQuantity,
}) => {
  const backgroundColor = useThemeColor({}, "background.1");
  const iconColor = useThemeColor({}, "text.3");
  const textColor = useThemeColor({}, "text");

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

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor },
          styles.capRight,
          pressed && { opacity: 0.5 },
        ]}
        onPress={handleDecrease}
      >
        <Feather name="minus" size={18} color={iconColor} />
      </Pressable>
      <ThemedView backgroundColor="background.1" style={styles.input}>
        <TextInput
          placeholder="quant."
          autoCorrect={false}
          autoCapitalize="none"
          textContentType="none"
          autoComplete="off"
          style={{
            flex: 1,
            color: textColor,
            fontSize: 16,
            textAlign: "center",
          }}
          value={String(quantity)}
          onChangeText={handleChangeText}
          keyboardType="numeric"
        />
      </ThemedView>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          { backgroundColor },
          styles.capLeft,
          pressed && { opacity: 0.5 },
        ]}
        onPress={handleIncrease}
      >
        <Feather name="plus" size={18} color={iconColor} />
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: 60,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 2,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 38,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#5B5B5B",
  },
  capLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  capRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});
