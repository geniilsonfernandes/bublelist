import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Icon } from "./ui/Icon";
import { ThemedView } from "./ui/ThemedView";

export const Search: React.FC<TextInputProps> = (props) => {
  const textColor = useThemeColor({}, "text.2");
  const iconColor = useThemeColor({}, "text.5");
  const placeholderColor = useThemeColor({}, "text.5");

  return (
    <ThemedView style={styles.container} backgroundColor="background.1">
      <Icon name="search" size={18} colorName="text.5" />
      <TextInput
        placeholder="Procurar Lista"
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: textColor }]}
        {...props}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    height: 56,
  },
  leftContainer: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
