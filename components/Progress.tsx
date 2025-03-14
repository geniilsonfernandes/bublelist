import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "./ui/ThemedView";

type ProgressProps = {
    progress: number;
};

export const Progress: React.FC<ProgressProps> = ({ progress}) => {
  return (
    <ThemedView colorName="background.2" style={styles.container}>
      <ThemedView
        colorName="background.5"
        style={{ height: 5, width: `${progress}%` }}
      />
    </ThemedView>
  );
};


const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
});
