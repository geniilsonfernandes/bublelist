import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { ThemedView } from "./ui/ThemedView";

export const Search: React.FC<TextInputProps> = (props) => {
  const textColor = useThemeColor({}, "text.2");
  const iconColor = useThemeColor({}, "text.5");
  const placeholderColor = useThemeColor({}, "text.5");

  return (
    <ThemedView style={styles.container} backgroundColor="background.1">
      <View style={styles.icon}>
        <Feather name="search" size={16} color={iconColor} />
      </View>
      <TextInput
        placeholder="Procurar Lista"
        placeholderTextColor={placeholderColor}
        style={[styles.input, { color: textColor }]}
        {...props}
      />
      {/* <TouchableOpacity>
        <ThemedView colorName="background" style={styles.leftContainer}>
          <Feather name="filter" size={18} color={iconColor} />
        </ThemedView>
      </TouchableOpacity> */}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 8,
    height: 52,
  },
  icon: {
    height: 32,
    width: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  leftContainer: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});
