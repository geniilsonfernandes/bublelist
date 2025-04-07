import "dayjs/locale/pt-br";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ui/ThemedView";

export default function Onboard() {
  return (
    <ThemedView colorName="background" style={styles.container}></ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/// criar switch
/// criar tela de onboaard
/// cria logica para tela de onboaard
