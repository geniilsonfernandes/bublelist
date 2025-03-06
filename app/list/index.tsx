import { Header } from "@/components/Header";
import { ListNameSuggestions } from "@/components/ListNameSuggestions";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemedView } from "@/components/ui/ThemedView";
import { ValueInput } from "@/components/ValueInput";
import { useCreateList } from "@/database/useShoppingList";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Feather } from "@expo/vector-icons";

import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function List() {
  const [showMore, { toggle: toggleShowMore }] = useDisclosure();
  const { mutate } = useCreateList();
  const router = useRouter();

  const [listName, setListName] = useState("");
  const [listBudget, setListBudget] = useState<number | null>(null);

  const handleCreateList = () => {
    mutate(
      {
        name: listName,
        budget: Number(listBudget),
      },
      {
        onSuccess: (data) => {
          router.replace(`/list/${data.id}`);
        },
      }
    );
  };

  return (
    <ThemedView colorName="background" style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerShadowVisible: false,
          headerLeft: () => <BackButton />,
        }}
      />
      <View>
        <Header
          title="Criar lista"
          subtitle="Escolha um nome para a sua lista de compras"
          style={styles.header}
        />
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
      <Button variant="solid" onPress={handleCreateList}>
        Criar lista
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "space-between" },
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
