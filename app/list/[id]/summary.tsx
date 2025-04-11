import { Button } from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useFindListById } from "@/state/use-list-store";
import { Product } from "@/state/use-products-store";
import { calculateTotal, formatValue } from "@/utils/calculateTotal";
import { sortAndFilterProducts } from "@/utils/sortAndFilterProducts";
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function Total() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const list = useFindListById(id);

  const orderedProducts = useMemo(() => {
    return sortAndFilterProducts({
      products: list?.products || [],
      orderBy: "quantity",
      search: "",
      filter: "Marcados",
    });
  }, [list?.products]);

  const renderProduct = ({ item: product }: { item: Product }) => {
    return (
      <ThemedView style={styles.productItem}>
        <ThemedText style={styles.productName} colorName="text.1" type="body">
          {product.name}
        </ThemedText>
        <ThemedText type="body" colorName="text.6">
          {formatValue(product.value)} x {product.quantity}
          {" | "}
          {formatValue(product.value * product.quantity)}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlashList
        data={orderedProducts || []}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <ThemedText colorName="text.3" type="title">
              Relatório: {list?.name}
            </ThemedText>
            <View style={styles.headerInfo}>
              <ThemedText colorName="text.1" type="body">
                {list?.budget ? formatValue(list.budget) : "-"}
              </ThemedText>
              <ThemedText colorName="text.1" type="body">
                {list?.products?.length || 0} Produtos
              </ThemedText>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        renderItem={renderProduct}
        ListFooterComponent={() => (
          <>
            <ThemedView bg="background.1" style={styles.footerSeparator} />
            <ThemedView style={styles.footerTotal}>
              <ThemedText colorName="text.1" type="body">
                Total
              </ThemedText>
              <ThemedText type="body" colorName="text.6">
                {formatValue(calculateTotal(orderedProducts))}
              </ThemedText>
            </ThemedView>
          </>
        )}
      />

      <Button
        variant="solid"
        onPress={() => router.push(`/history`)}
        leftIcon="paperclip"
      >
        Histórico de compras
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  headerContainer: {
    marginBottom: 32,
    gap: 8,
  },
  headerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSeparator: {
    height: 4,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productName: {
    flex: 1,
    maxWidth: "80%",
  },
  footerSeparator: {
    height: 1,
    width: "100%",
    marginVertical: 8,
  },
  footerTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
