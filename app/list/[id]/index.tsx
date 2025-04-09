import { EmptyList } from "@/components/EmptyList";
import { PillList } from "@/components/PillList";
import { ProductEntry } from "@/components/ProductEntry";
import { TotalBar } from "@/components/TotalBar";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useGetListById } from "@/database/useShoppingList";
import { db } from "@/lib/firebase";
import { useListStore } from "@/store/useActiveList";
import { useConfigStore } from "@/store/useConfigStore";
import {
  SortAndFilterParams,
  sortAndFilterProducts,
} from "@/utils/sortAndFilterProducts";
import { Stack, useLocalSearchParams } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut } from "react-native-reanimated";
// Constantes
const OPTIONS = ["Todos", "Marcados", "Desmarcados"] as const;

export default function ListShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { list } = useListStore();
  const { data, isLoading } = useGetListById(id);
  const { show_suggestions, show_total, order_by, setConfig } =
    useConfigStore();

  // Estados
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]>("Todos");

  // Funções de ordenação e filtro
  const orderedProducts = useMemo(() => {
    return sortAndFilterProducts({
      products: data?.products || [],
      orderBy: order_by as SortAndFilterParams["orderBy"],
      search,
      filter,
    });
  }, [search, data?.products, filter, order_by]);

  useEffect(() => {
    const sync = async () => {
      await setDoc(
        doc(db, "shoppingList", id),
        {
          ...list,
        },
        { merge: true }
      );
    };

    sync();
  }, [data]);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: data?.name || "Lista",

          headerShown: true,
          headerRight: () => (
            <View style={styles.headerIcons}>
              <ActionButton
                style={styles.headerIcons}
                onPress={() => setShowSearch(!showSearch)}
                variant={showSearch ? "solid" : "ghost"}
                size="sm"
              >
                <Icon name="search" size={18} />
              </ActionButton>
            </View>
          ),
        }}
      />

      {/* Barra de Ações (Pesquisa + Filtros) */}
      <View style={styles.actionBar}>
        {!showSearch && (
          <Animated.View
            style={{ flexDirection: "row", gap: 8 }}
            entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
            exiting={FadeOut.duration(200).easing(Easing.inOut(Easing.quad))}
          >
            {OPTIONS.map((value) => (
              <ActionButton
                key={value}
                variant={filter === value ? "solid" : "outline"}
                onPress={() => setFilter(value)}
              >
                <ThemedText type="body">{value}</ThemedText>
              </ActionButton>
            ))}
          </Animated.View>
        )}
        {showSearch && (
          <Animated.View
            style={{ flex: 1, flexDirection: "row", gap: 8 }}
            entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
            exiting={FadeOut.duration(200).easing(Easing.inOut(Easing.quad))}
          >
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder="Pesquisar"
              size="md"
              bg="background.1"
              fullWidth
              showActions={false}
              leftIcon="search"
            />
            <ActionButton variant="solid" onPress={() => setShowSearch(false)}>
              <ThemedText type="body">Fechar</ThemedText>
            </ActionButton>
          </Animated.View>
        )}
      </View>

      {/* Lista de Produtos (Pills) */}
      <PillList data={orderedProducts} ListEmptyComponent={<EmptyList />} />

      <TotalBar
        data={data?.products || []}
        show={show_total}
        budget={data?.budget || 0}
      />

      <ProductEntry currentList={data} showSuggestions={show_suggestions} />
    </ThemedView>
  );
}

// Estilos
const styles = StyleSheet.create({
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    paddingVertical: 8,
  },
});
