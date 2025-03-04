import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

type ListProps = {
  title: string;
  quantity: number;
  onPress: () => void;
  onLongPress: () => void;
};

export const List: React.FC<ListProps> = ({
  title,
  quantity,
  onPress,
  onLongPress,
}) => {
  const progress = (25 / 30) * 100;

  const handlePressLong = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
    onLongPress();
  };

  return (
    <TouchableOpacity onLongPress={handlePressLong} onPress={onPress}>
      <ThemedView backgroundColor="background.1" style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.quantity} colorName="text.3">
            0/{quantity}
          </ThemedText>
        </ThemedView>
        <ThemedView colorName="background.2" style={styles.progress}>
          <ThemedView
            colorName="background.5"
            style={{ height: 5, width: `${progress}%` }}
          />
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 16,
    width: "100%",
    flex: 1,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  title: {
    fontSize: 16,
  },
  quantity: {
    fontSize: 12,
  },

  progress: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 16,
  },
});
