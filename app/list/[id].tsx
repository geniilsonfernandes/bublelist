import { ListOptions } from "@/components/ListOptions";
import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { ThemedText } from "@/components/ThemedText";
import { BackButton } from "@/components/ui/BackButton";
import { useAppContext } from "@/context/AppProvider";
import { Product as ProductType } from "@/database/useShoppingList";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function ListView() {
  const { loadListById, selectProduct, refreshList, currentList } =
    useAppContext();

  const { id } = useLocalSearchParams() as { id: string };

  const productList = useMemo(
    () => currentList?.products || [],
    [currentList?.products]
  );

  const renderList = useCallback(
    ({ item }: { item: ProductType }) => (
      <Product
        {...item}
        onSelect={() => selectProduct(item)}
        invalidateList={refreshList}
      />
    ),
    []
  );

  useEffect(() => {
    loadListById(id);
  }, [loadListById]);

  console.log(currentList);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "",
          headerShadowVisible: false,
          headerLeft: () => <BackButton to="Home" />,
          headerRight: () => <ListOptions />,
        }}
      />

      <View style={styles.header}>
        <ThemedText colorName="text.1" type="subtitle">
          {currentList?.name}
        </ThemedText>
        <View style={styles.stats}>
          <ThemedText colorName="text.3" type="body">
            {currentList?.products.length || 0} produtos
          </ThemedText>
          {currentList?.budget ? (
            <ThemedText colorName="text.3" type="body">
              {currentList.budget} / 120,00
            </ThemedText>
          ) : null}
        </View>
      </View>

      <Animated.FlatList
        data={productList}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderList}
      />

      <View style={styles.productEntry}>
        <ProductEntry />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    position: "relative",
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
    marginTop: 8,
  },
  productEntry: {
    marginVertical: 8,
    bottom: 0,
  },

  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 24,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  modalButton: {
    padding: 10,
  },
});
