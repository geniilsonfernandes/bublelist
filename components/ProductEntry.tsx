import {
  List,
  useAddProduct,
  useDeleteProduct,
  useEditProduct,
} from "@/database/useShoppingList";
import {
  filterProductsInList,
  useFilteredProducts,
} from "@/hooks/useFilteredProducts";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { extractNumberAndClean } from "@/utils/extractNumberAndClean";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { View } from "react-native";
import { ProductInput } from "./ProductInput";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

export const PRODUCT_DATA = [
  "Arroz",
  "Feijão",
  "Macarrão",
  "Açúcar",
  "Sal",
  "Óleo",
  "Farinha de trigo",
  "Leite",
  "Café",
  "Manteiga",
  "Ovos",
  "Pão",
  "Queijo",
  "Presunto",
  "Carne bovina",
  "Carne de frango",
  "Peixe",
  "Batata",
  "Cebola",
  "Alho",
  "Tomate",
  "Cenoura",
  "Alface",
  "Banana",
  "Maçã",
  "Laranja",
  "Uva",
  "Pera",
  "Melancia",
  "Manga",
  "Iogurte",
  "Refrigerante",
  "Suco",
  "Água mineral",
  "Biscoito",
  "Chocolate",
  "Sorvete",
  "Molho de tomate",
  "Maionese",
  "Mostarda",
  "Papel higiênico",
  "Detergente",
  "Sabão em pó",
  "Amaciante",
  "Shampoo",
  "Condicionador",
  "Creme dental",
  "Escova de dente",
  "Sabonete",
  "Desodorante",
];

const INITIAL_QUANTITY = 1;

type ProductEntryProps = {
  showSuggestions?: boolean;
  currentList?: List;
};

export const ProductEditEntry = () => {
  const { setSelectedProduct, selectedProduct } = useModals();
  const { mutate } = useEditProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const [productName, setProductName] = useState(selectedProduct?.name || "");
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 1);
  const [value, setValue] = useState<number | null>(
    selectedProduct?.value || null
  );

  const handleEditProduct = () => {
    if (selectedProduct) {
      mutate(
        {
          ...selectedProduct,
          name: productName,
          quantity,
          value: value || 0,
        },
        {
          onSuccess: () => {
            setSelectedProduct(null);
          },
        }
      );
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct.id);
      setSelectedProduct(null);
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingBottom: 16,
          display: "none",
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            height: 56,
            paddingHorizontal: 16,
            alignItems: "center",
            gap: 8,
            borderRadius: 8,

            flex: 1,
          }}
          bg="background.1"
        >
          <Icon name="shopping-bag" size={24} colorName="text.2" />
          <ThemedText type="title.3">{selectedProduct?.name}</ThemedText>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 16,
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 8,
                alignItems: "center",
              }}
            >
              <Icon name="shopping-cart" size={16} colorName="text.4" />
              <ThemedText colorName="text.4" type="defaultSemiBold">
                {selectedProduct?.quantity}
              </ThemedText>
            </View>

            <ThemedText colorName="text" type="defaultSemiBold" opacity={0.7}>
              {selectedProduct?.value && formatValue(selectedProduct.value)}
            </ThemedText>
          </View>
        </ThemedView>
        <Button
          variant="solid"
          bg="danger"
          onPress={handleDeleteProduct}
          style={{ height: 56, width: 70 }}
        >
          <Icon name="trash" size={16} colorName="text" />
        </Button>
      </View>
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
};

export const ProductEntry: React.FC<ProductEntryProps> = ({
  showSuggestions = false,
  currentList,
}) => {
  const { mutate: addProduct } = useAddProduct();
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
  const [price, setPrice] = useState<number | null>(null);

  const resetFields = () => {
    setProductName("");
    setQuantity(INITIAL_QUANTITY);
    setPrice(null);
  };

  const handleAddProduct = () => {
    if (!currentList?.id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const extractedProduct = extractNumberAndClean(productName);

    addProduct(
      {
        list_id: currentList.id,
        name: extractedProduct.name,
        quantity: extractedProduct.quantity || quantity,
        value: price || 0,
        checked: false,
      },
      {
        onSuccess: resetFields,
      }
    );
  };

  const suggestedProducts = useFilteredProducts(productName, PRODUCT_DATA);

  const selectSuggestedProduct = (name: string) => {
    const existingProduct = filterProductsInList(name, currentList?.products);

    if (existingProduct) {
      setProductName(existingProduct.name);
      setQuantity(existingProduct.quantity);
      setPrice(existingProduct.value);
    } else {
      setProductName(name);
    }
  };

  return (
    <ProductInput
      showSuggestions={showSuggestions}
      productName={productName}
      setProductName={setProductName}
      quantity={quantity}
      setQuantity={setQuantity}
      price={price}
      setPrice={setPrice}
      handleAddProduct={handleAddProduct}
      suggestedProducts={suggestedProducts}
      selectSuggestedProduct={selectSuggestedProduct}
    />
  );
};
