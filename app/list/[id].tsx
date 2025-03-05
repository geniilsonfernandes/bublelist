import { ListOptions } from "@/components/ListOptions";
import { Product } from "@/components/Product";
import { ProductEntry } from "@/components/ProductEntry";
import { ThemedText } from "@/components/ThemedText";
import { BackButton } from "@/components/ui/BackButton";
import {
  Product as ProductType,
  useGetListById,
} from "@/database/useShoppingList";
import { calculateTotal } from "@/utils/calculateTotal";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

export default function ListView() {
  const { id } = useLocalSearchParams() as { id: string };
  const { data } = useGetListById(id);

  const renderList = useCallback(
    ({ item }: { item: ProductType }) => <Product {...item} />,
    []
  );

  const valuesSum = useMemo(() => {
    return calculateTotal(data?.products || []);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: data?.name,
          headerTitleStyle: { fontSize: 18 },
          headerTitleAlign: "center",
          headerBackTitle: "Voltar",
          headerShadowVisible: false,
          headerLeft: () => <BackButton to="Home" />,
          headerRight: () => <ListOptions />,
        }}
      />

      <View style={styles.header}>
        <View style={styles.stats}>
          <ThemedText colorName="text.3" type="body">
            {data?.products.length || 0} produtos
          </ThemedText>

          <ThemedText colorName="text.3" type="body">
            {data?.budget} /{valuesSum}
          </ThemedText>
        </View>
      </View>

      <Animated.FlatList
        data={data?.products || []}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition}
        renderItem={renderList}
      />

      <View style={styles.productEntry}>
        <ProductEntry currentList={data} />
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
