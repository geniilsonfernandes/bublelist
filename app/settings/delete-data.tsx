import { SettingsButton } from "@/components/ui/SettingsButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { useListStore } from "@/state/use-list-store";
import { useProductsStore } from "@/state/use-products-store";
// import { useDeleteAllLists } from "@/database/useShoppingList";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

export default function DeleteData() {
  const { clear } = useListStore();
  const { clearHistory } = useProductsStore();
  const router = useRouter();
  const createThreeButtonAlert = () =>
    Alert.alert(
      "Confirmação",
      "Tem certeza que deseja apagar todos os dados?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Ação cancelada"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            clear();
            clearHistory();
            router.back();
            console.log("Dados apagados com sucesso");
          },
        },
      ]
    );

  return (
    <ThemedView
      style={{ flex: 1, paddingHorizontal: 16, gap: 48, paddingTop: 16 }}
    >
      <SettingsButton
        onPress={createThreeButtonAlert}
        icon="trash-2"
        label="Apagar dados"
      />
    </ThemedView>
  );
}
