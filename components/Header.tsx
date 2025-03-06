import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ui/ThemedText";

type HeaderProps = {
  title: string;
  subtitle?: string;
};

export const Header: React.FC<HeaderProps> = ({ subtitle, title }) => {
  return (
    <View style={styles.header}>
      <ThemedText type="title.2">{title}</ThemedText>
      <ThemedText type="body" colorName="text.4">
        {subtitle}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "space-between" },
  header: { marginBottom: 48 },
  suggestionContainer: { marginTop: 8 },
  suggestionTitle: { marginTop: 8 },
});
