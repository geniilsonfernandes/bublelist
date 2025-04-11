import {
  LIST_NAME_SUGGESTIONS,
  ListNameSuggestions,
} from "@/components/ListNameSuggestions";
import { ActionButton } from "@/components/ui/ActionButton";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ui/ThemedView";
import { ValueInput } from "@/components/ValueInput";
import { useFindListById, useListStore } from "@/state/use-list-store";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, ToastAndroid, View } from "react-native";

export default function NewList() {
  const router = useRouter();
  const { create, setActiveList, update, remove } = useListStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const list = useFindListById(id);

  const isEdit = id;

  const [listName, setListName] = useState(list?.name || "");
  const [listBudget, setListBudget] = useState<number | null>(
    list?.budget || null
  );

  const handleCreateList = async () => {
    const data = {
      id: Date.now().toString(),
      name: listName || LIST_NAME_SUGGESTIONS[0],
      budget: Number(listBudget),
      color: "",
      icon: "",
      products: [],
    };

    if (isEdit) {
      update(id, {
        id,
        name: data.name,
        budget: data.budget,
      });
      ToastAndroid.show("Lista atualizada com sucesso", ToastAndroid.SHORT);
      router.back();
      return;
    }

    create(data);
    setActiveList(data.id);
    router.replace("/list/[id]");
  };

  const handleDeleteList = () => {
    Alert.alert(
      "Excluir lista",
      "Tem certeza que deseja excluir esta lista? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            if (!list) return;
            remove(list.id);
            ToastAndroid.show("Lista excluida com sucesso", ToastAndroid.SHORT);
            router.back();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ThemedView colorName="background" style={styles.container}>
      <Stack.Screen
        options={{
          title: isEdit ? list.name : "Nova lista",

          headerRight: () => (
            <View>
              {isEdit && (
                <ActionButton onPress={handleDeleteList} size="sm">
                  <Icon name="trash" size={18} />
                </ActionButton>
              )}
            </View>
          ),
        }}
      />
      <View style={styles.content}>
        <View
          style={{
            gap: 4,
          }}
        >
          <Input
            placeholder="Nome da lista"
            value={listName}
            onChangeText={setListName}
            showActions={false}
            pl={16}
            bg="background.1"
          />
          <ListNameSuggestions onAcceptSuggestion={setListName} />
        </View>

        <ValueInput
          placeholder="Orçamento da lista"
          controlButtons
          value={listBudget}
          onChangeValue={setListBudget}
          bg="background.1"
        />
      </View>
      <View
        style={{
          gap: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          bg="background.1"
          leftIcon={isEdit ? "check" : "plus"}
          fullWidth
          variant="solid"
          onPress={handleCreateList}
        >
          {isEdit ? "Salvar" : "Criar lista"}
        </Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  content: { gap: 16 },

  header: { marginBottom: 16 },
  suggestionContainer: { marginTop: 8 },
  suggestionTitle: { marginTop: 8 },

  separator: { width: "100%", height: 1, backgroundColor: "#4E4E4E" },
  createButton: {
    backgroundColor: "#4E4E4E",
    height: 48,
    borderRadius: 16,
    width: "100%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  budgetContainer: { marginTop: 16 },
  createButtonText: { color: "#dddddd", fontSize: 16, fontWeight: "500" },
  icon: { alignSelf: "center", padding: 8 },
  budgetButtonContainer: { flexDirection: "row", gap: 8 },
  budgetButton: {
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
