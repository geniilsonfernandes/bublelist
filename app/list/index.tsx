import { Chip } from "@/components/Chip";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/Input";
import { useShoppingList } from "@/database/useShoppingList";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Feather, Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const LIST_NAME_SUGGESTIONS = [
  "Feira da Semana",
  `Lista de ${dayjs().locale("pt-br").format("MMMM")}`,
  `${dayjs().format("DD/MM/YYYY")}`,
  "Compras Mensais",
  "Itens de Padaria",
  "Carnes e Frios",
  "Produtos de Limpeza",
  "Farmácia",
  "Lanches e Snacks",
  "Café da Manhã",
  "Churrasco",
  "Jantar Especial",
];

export default function List() {
  const [showMore, { toggle: toggleShowMore }] = useDisclosure();
  const router = useRouter();

  const [listName, setListName] = useState("");
  const [listBudget, setListBudget] = useState("");

  const shoppingList = useShoppingList();

  const handleGetRandomName = useCallback(() => {
    const randomName =
      LIST_NAME_SUGGESTIONS[
        Math.floor(Math.random() * LIST_NAME_SUGGESTIONS.length)
      ];
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setListName(randomName);
  }, []);

  const handleBudgetChange = useCallback((increment: boolean) => {
    setListBudget((prev) => {
      const newValue = Math.max(Number(prev) + (increment ? 50 : -50), 0);
      if (!increment && newValue === 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      return String(newValue);
    });
  }, []);

  const handleCreateList = async () => {
    try {
      const id = await shoppingList.create({
        name: listName,
        budget: Number(listBudget),
        
      });

      router.push(`/list/${id.id}`);
    } catch (error) {
      console.log(error);
    }
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
        <View style={styles.header}>
          <ThemedText type="title.2">Criar lista</ThemedText>
          <ThemedText type="body" colorName="text.4">
            Escolha um nome para a sua lista de compras
          </ThemedText>
        </View>

        <Input
          placeholder="Nome da lista"
          value={listName}
          onChangeText={(text) => {
            setListName(text);
          }}
          iconName="repeat"
          onIconPress={handleGetRandomName}
        />
        <ThemedText
          type="body"
          style={styles.suggestionTitle}
          colorName="text.4"
        >
          Sugestões:
        </ThemedText>
        <FlatList
          data={LIST_NAME_SUGGESTIONS}
          horizontal
          contentContainerStyle={styles.suggestionContainer}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setListName(item);
              }}
            >
              <Chip label={item} active={item === listName} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />

        {showMore && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            style={styles.budgetContainer}
          >
            <Input
              placeholder="Orçamento da lista"
              value={listBudget}
              onChangeText={setListBudget}
              keyboardType="numeric"
              rightSection={
                <View style={styles.budgetButtonContainer}>
                  <Pressable
                    style={styles.budgetButton}
                    onPress={() => handleBudgetChange(false)}
                  >
                    <Feather name="minus" size={16} color="#121212" />
                  </Pressable>
                  <Pressable
                    style={styles.budgetButton}
                    onPress={() => handleBudgetChange(true)}
                  >
                    <Feather name="plus" size={16} color="#121212" />
                  </Pressable>
                </View>
              }
            />
          </Animated.View>
        )}
        <Feather
          name={showMore ? "chevron-up" : "chevron-down"}
          size={24}
          style={styles.icon}
          onPress={toggleShowMore}
          color="#C5C5C5"
        />
      </View>
      <Pressable
        style={styles.createButton}
        onPress={handleCreateList}
        accessibilityRole="button"
      >
        <Ionicons name="sparkles" size={16} color="#dddddd" />
        <Text style={styles.createButtonText}>Criar lista</Text>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "space-between" },
  header: { marginBottom: 48 },
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
