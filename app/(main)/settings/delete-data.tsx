import { IconButtonWithLabel } from "@/components/ui/IconButtonWithLabel";
import { useDeleteAllLists } from "@/database/useShoppingList";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, View } from "react-native";

export default function DeleteData() {
  const { mutate: deleteAllLists } = useDeleteAllLists();
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
            deleteAllLists()
            router.back();
            console.log("Dados apagados com sucesso");
          },
        },
      ]
    );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, gap: 48, paddingTop: 16 }}>
      <IconButtonWithLabel
        onPress={createThreeButtonAlert}
        variant="solid"
        icon="trash-2"
        rightIcon="none"
        label="Apagar dados"
      />
    </View>
  );
}
