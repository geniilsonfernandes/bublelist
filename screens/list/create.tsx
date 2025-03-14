import { LIST_NAME_SUGGESTIONS, ListNameSuggestions } from "@/components/ListNameSuggestions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { ValueInput } from "@/components/ValueInput";
import {
  useCreateList,
  useEditList,
  useGetListById,
} from "@/database/useShoppingList";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Feather } from "@expo/vector-icons";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function ListCreateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEdit = id !== undefined;

  const { data } = useGetListById(id);

  const [showMore, { toggle: toggleShowMore }] = useDisclosure(isEdit);
  const { mutate: createList } = useCreateList();
  const { mutate: editList } = useEditList();
  const router = useRouter();

  const [listName, setListName] = useState(data?.name || "");
  const [listBudget, setListBudget] = useState<number | null>(
    data?.budget || null
  );

  const handleCreateList = () => {
    if (isEdit) {
      editList(
        {
          id: id,
          name: listName || LIST_NAME_SUGGESTIONS[0],
          budget: Number(listBudget),
        },
        {
          onSuccess: () => {
            router.back();
          },
        }
      );
      return;
    }
    createList(
      {
        name: listName || LIST_NAME_SUGGESTIONS[0],
        budget: Number(listBudget),
      },
      {
        onSuccess: (data) => {
          router.replace(`/(main)/lista/${data.id}`);
        },
      }
    );
  };

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View>
        <ThemedText
          type="body"
          style={{
            marginVertical: 16,
          }}
        >
          Escolha um nome para a sua lista de compras
        </ThemedText>
        <Input
          placeholder="Nome da lista"
          value={listName}
          onChangeText={setListName}
          showActions={false}
          cap="bottom"
        />
        <ListNameSuggestions onAcceptSuggestion={setListName} />

        {showMore && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            style={styles.budgetContainer}
          >
            <ValueInput
              placeholder="Orçamento da lista"
              controlButtons
              value={listBudget}
              onChangeValue={setListBudget}
              cap="top"
            />
          </Animated.View>
        )}

        {!showMore ? (
          <Feather
            name={showMore ? "chevron-up" : "chevron-down"}
            size={24}
            style={styles.icon}
            onPress={toggleShowMore}
            color="#C5C5C5"
          />
        ) : null}
      </View>
      <View
        style={{
          gap: 8,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button variant="outline" fullWidth onPress={() => router.back()}>
          Cancelar
        </Button>
        <Button fullWidth variant="solid" onPress={handleCreateList}>
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
  header: { marginBottom: 16 },
  suggestionContainer: { marginTop: 8 },
  suggestionTitle: { marginTop: 8 },

  separator: { width: 8 },
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
