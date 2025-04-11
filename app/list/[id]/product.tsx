import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ProductInput } from "@/components/ProductInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useGetProductById, useListStore } from "@/state/use-list-store";

export default function Product() {
  const router = useRouter();
  const bg = useThemeColor({}, "background");

  const { updateProduct, removeProduct } = useListStore();
  const { query, id } = useLocalSearchParams<{ query: string; id: string }>();
  const product = useGetProductById(query, id);

  // State
  const [productName, setProductName] = useState(product?.name || "");
  const [quantity, setQuantity] = useState(product?.quantity || 1);
  const [value, setValue] = useState(product?.value || null);

  const handleEditProduct = () => {
    if (!product) return;

    updateProduct(product.id, {
      name: productName,
      quantity,
      value: value || 0,
    });

    router.back();
  };

  const handleDeleteProduct = () => {
    if (!product) return;

    removeProduct(product.id);

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: bg + "f1" }]}>
      <TouchableOpacity onPress={router.back} style={styles.overlay} />

      <ThemedView style={styles.header} bg="background.1">
        <View style={styles.titleContainer}>
          <Icon name="shopping-cart" size={16} />
          <ThemedText type="default" style={{ maxWidth: "80%" }}>
            {productName}
          </ThemedText>
        </View>

        <ActionButton onPress={handleDeleteProduct} variant="ghost" size="sm">
          <Icon name="trash" size={18} />
        </ActionButton>
      </ThemedView>

      <ProductInput
        productName={productName}
        setProductName={setProductName}
        quantity={quantity}
        setQuantity={setQuantity}
        price={value}
        setPrice={setValue}
        handleAddProduct={handleEditProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 8,
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginLeft: 8,
  },
});
