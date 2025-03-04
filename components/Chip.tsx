import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ChipProps = {
  label: string;
  active?: boolean;
};

export const Chip: React.FC<ChipProps> = ({ label, active }) => {
  return (
    <ThemedView
      borderColor={active ? "background.4" : "background.1"}
      colorName={active ? "background.3" : "background.1"}
      style={styles.container}
    >
      <ThemedText
        colorName={active ? "text.1" : "text.4"}
        style={{ fontSize: 16 }}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});