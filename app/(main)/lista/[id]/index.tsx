import { EmptyList } from "@/components/EmptyList";
import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { Search } from "@/components/Search";
import { Icon, IconProps } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import {
  Product as ProductType,
  useGetListById,
} from "@/database/useShoppingList";
import { calculateTotal } from "@/utils/calculateTotal";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function ListShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useGetListById(id);

  // Estados
  const [search, setSearch] = useState("");
  const [showEntry, setShowEntry] = useState(true);

  // Filtragem dos produtos com base no search
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    return data.products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data?.products]);

  // Renderização dos itens da lista
  const renderList = useCallback(
    ({ item }: { item: ProductType }) => <Product {...item} />,
    []
  );

  // Cálculo total dos valores da lista
  const valuesSum = useMemo(
    () => calculateTotal(data?.products || []),
    [data?.products]
  );

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: data?.name,
          headerShown: true,
          headerRight: () => (
            <View style={styles.headerIcons}>
              <Icon name="menu" size={18} />
            </View>
          ),
        }}
      />
      <View>
        <ScrollView
          style={styles.actionBar}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <Search
            onFocus={() => setShowEntry(false)}
            onforceBlur={() => setShowEntry(true)}
            onBlur={() => setShowEntry(true)}
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.spacing} />
          <ActionButton icon="filter" label="Ordenar" />
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Animated.FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          itemLayoutAnimation={LinearTransition}
          renderItem={renderList}
          ItemSeparatorComponent={() => (
            <ThemedView
              style={styles.separator}
              backgroundColor="background.1"
            />
          )}
          ListEmptyComponent={EmptyList}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={5}
          keyboardShouldPersistTaps="always"
          getItemLayout={(data, index) => ({
            length: 50,
            offset: 50 * index,
            index,
          })}
        />
        <ThemedView style={styles.cartSummary} backgroundColor="background.1">
          <Icon name="shopping-cart" size={18} colorName="text.2" />
          <ThemedText colorName="text.2" type="defaultSemiBold">
            {valuesSum}
          </ThemedText>
        </ThemedView>
      </View>
      {/* Entrada de produtos */}
      {showEntry && (
        <ThemedView backgroundColor="background.1" style={styles.productEntry}>
          <ProductEntry currentList={data} showSuggestions />
        </ThemedView>
      )}
    </View>
  );
}

const ActionBar = () => {};

// Botão reutilizável para filtros e ações
const ActionButton = ({
  icon = "filter",
  label,
}: {
  icon: IconProps["name"];
  label: string;
}) => (
  <ThemedView style={styles.actionButton} backgroundColor="background.1">
    <Icon name={icon} size={18} colorName="text.2" />
    <ThemedText colorName="text.2" type="default">
      {label}
    </ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    borderBottomEndRadius: 24,
    borderBottomStartRadius: 24,
    paddingBottom: 16,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionBar: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  spacing: {
    width: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    height: 42,
    gap: 8,
    paddingHorizontal: 16,
  },
  list: {
    paddingBottom: 48,
  },
  listContent: {
    paddingBottom: 48,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginVertical: 100,
  },
  cartSummary: {
    position: "absolute",
    bottom: 16,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    height: 38,
    gap: 8,
    paddingHorizontal: 16,
  },
  productEntry: {
    paddingHorizontal: 16,
    borderTopEndRadius: 32,
    borderTopStartRadius: 32,
  },
});
