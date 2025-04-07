import {
  LIST_NAME_SUGGESTIONS,
  ListNameSuggestions,
} from "@/components/ListNameSuggestions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ui/ThemedView";
import { ValueInput } from "@/components/ValueInput";
import { useCreateList, useEditList } from "@/database/useShoppingList";
import { useEmojiStore } from "@/store/useEmojiStore";
import { useListStore } from "@/store/useListStore";

import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";

export default function ListCreateScreen() {
  const { setList, list, clearList } = useListStore();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    background,
    emoji: emojiSelected,
    setBackground,
    setEmoji,
  } = useEmojiStore();

  const isEdit = id;

  const { mutate: createList } = useCreateList();
  const { mutate: editList } = useEditList();
  const router = useRouter();

  const [listName, setListName] = useState(isEdit ? list?.name : "");
  const [listBudget, setListBudget] = useState<number | null>(
    isEdit ? list?.budget || null : null
  );

  const handleCreateList = () => {
    if (isEdit) {
      editList(
        {
          id: id,
          name: listName || LIST_NAME_SUGGESTIONS[0],
          budget: Number(listBudget),
          color: background,
          icon: emojiSelected,
        },
        {
          onSuccess: () => {
            ToastAndroid.show("Lista atualizada", ToastAndroid.SHORT);
            clearList();
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
        color: background,
        icon: emojiSelected,
      },
      {
        onSuccess: (data) => {
          router.replace(`/(list)/show/${data.id}`);
          setList(data);
        },
      }
    );
  };

  useEffect(() => {
    if (isEdit && list) {
      setEmoji(list.icon || "🍔");
      setBackground(list.color || "#FFC107");
    }
  }, [list]);

  return (
    <ThemedView colorName="background" style={styles.container}>
      <View style={styles.content}>
        {/* <Emoji
          color={background}
          emoji={emojiSelected}
          showButton
          onPress={() => router.push("/emoji")}
        /> */}

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
  content: { gap: 16 },

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
