import { EmptyList } from "@/components/EmptyList";
import { PillList } from "@/components/PillList";
import { ProductEntry } from "@/components/ProductEntry";
import { TotalBar } from "@/components/TotalBar";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useConfigStore } from "@/state/use-config-store";

import { useFindListById, useListStore } from "@/state/use-list-store";
import { Product } from "@/state/use-products-store";
import { formatValue } from "@/utils/calculateTotal";

import {
  SortAndFilterParams,
  sortAndFilterProducts,
} from "@/utils/sortAndFilterProducts";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyle,
  Easing,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
// Constantes
const OPTIONS = ["Todos", "Marcados", "Desmarcados"] as const;

const FadeInView: React.FC<{
  children: React.ReactNode;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}> = ({ children, style }) => (
  <Animated.View
    entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
    exiting={FadeOut.duration(200).easing(Easing.inOut(Easing.quad))}
    style={style}
  >
    {children}
  </Animated.View>
);

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <ThemedView
      style={{
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 8,

        gap: 16,
      }}
      bg="background.1"
    >
      <ThemedView
        bg="background.2"
        style={{
          borderRadius: 6,
          width: 48,
          height: 48,
        }}
      />
      <View
        style={{
          flexDirection: "column",
          alignItems: "flex-start",

          flex: 1,
        }}
      >
        <ThemedText
          style={{
            fontSize: 18,
          }}
        >
          {product.name}
        </ThemedText>

        <ThemedText
          colorName="text.5"
          style={{
            fontSize: 12,
          }}
        >
          {formatValue(product.value)}
        </ThemedText>
      </View>

      <ThemedText
        style={{
          fontSize: 24,
        }}
      >
        {product.quantity}
      </ThemedText>
    </ThemedView>
  );
};

export default function ListShowScreen() {
  const router = useRouter();
  const { show_suggestions, show_total, order_by } = useConfigStore();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addProduct } = useListStore();
  const list = useFindListById(id);

  const products = list?.products || [];

  // Estados
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filter, setFilter] = useState<(typeof OPTIONS)[number]>("Todos");

  // Funções de ordenação e filtro
  const orderedProducts = useMemo(() => {
    return sortAndFilterProducts({
      products: products,
      orderBy: order_by as SortAndFilterParams["orderBy"],
      search,
      filter,
    });
  }, [search, filter, order_by, products]);

  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: list?.name || "Lista",

          headerShown: true,
          headerRight: () => (
            <View style={styles.headerIcons}>
              <ActionButton
                style={styles.headerIcons}
                onPress={handleShowSearch}
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
          <FadeInView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
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
          </FadeInView>
        )}
        {showSearch && (
          <FadeInView
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
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
          </FadeInView>
        )}
      </View>

      {/* <FlashList
        data={orderedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard key={item.id} product={item} />}
        estimatedItemSize={50}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={<EmptyList />}
      /> */}
      <PillList data={orderedProducts} ListEmptyComponent={<EmptyList />} />

      <TotalBar
        data={products}
        show={show_total}
        budget={list?.budget || 0}
        onPress={() => {
          router.push(`/list/${id}/summary`);
        }}
      />

      <ProductEntry
        addProduct={addProduct}
        currentList={list}
        showSuggestions={show_suggestions}
      />
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
