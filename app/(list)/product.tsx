import { ProductInput } from "@/components/ProductInput";
import { ActionButton } from "@/components/ui/ActionButton";
import { Icon } from "@/components/ui/Icon";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useDeleteProduct, useEditProduct } from "@/database/useShoppingList";
import { useModals } from "@/store/useModals";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";

export default function Product() {
  const router = useRouter();
  const { setSelectedProduct, selectedProduct } = useModals();
  const { mutate: editProduct } = useEditProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [productName, setProductName] = useState(selectedProduct?.name || "");
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 1);
  const [value, setValue] = useState(selectedProduct?.value || null);

  const handleEditProduct = () => {
    if (!selectedProduct) return;

    editProduct(
      { ...selectedProduct, name: productName, quantity, value: value || 0 },
      {
        onSuccess: () => {
          ToastAndroid.show("Produto atualizado", ToastAndroid.SHORT);
          setSelectedProduct(null);
          router.back();
        },
      }
    );
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    deleteProduct(selectedProduct.id, {
      onSuccess: () => {
        ToastAndroid.show("Produto deletado", ToastAndroid.SHORT);
        setSelectedProduct(null);
        router.back();
      },
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={router.back} style={styles.overlay} />

      <ThemedView style={styles.header} bg="background.1">
        <View style={styles.titleContainer}>
          <Icon name="shopping-cart" size={16} />
          <ThemedText type="default">{productName}</ThemedText>
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
    backgroundColor: "rgba(17, 17, 17, 0.69)",
    gap: 8,
  },
  overlay: {
    flex: 1,
    width: "100%",
  },
  header: {
    padding: 8,
    
    
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginLeft: 8,
  },
});
