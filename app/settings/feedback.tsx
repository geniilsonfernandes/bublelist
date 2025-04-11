import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { ThemedText } from "@/components/ui/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function Feedback() {
  const backgroundColorSheet = useThemeColor({}, "background");
  const handleEmailPress = () => {
    Linking.openURL("orriker.dev@gmail.com");
  };

  return (
    <BodyScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: backgroundColorSheet, flex: 1 },
      ]}
    >
      <View style={styles.section}>
        <ThemedText type="title">Conversar com o desenvolvedor</ThemedText>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.paragraph}>
          Tem alguma dúvida, sugestão ou encontrou um problema? Fique à vontade
          para enviar um e-mail:
        </ThemedText>

        <Pressable onPress={handleEmailPress}>
          <ThemedText style={styles.email}>orriker.dev@gmail.com</ThemedText>
        </Pressable>
      </View>
    </BodyScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  section: {
    marginBottom: 24,
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 24,
  },
  email: {
    color: "#007AFF",
    marginTop: 8,
    fontWeight: "bold",
  },
});
