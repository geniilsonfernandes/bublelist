import {
  filterProductsInList,
  useFilteredProducts,
} from "@/hooks/useFilteredProducts";
import { List, ListStore } from "@/state/use-list-store";
import { extractNumberAndClean } from "@/utils/extractNumberAndClean";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { ProductInput } from "./ProductInput";

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
  addProduct: ListStore["addProduct"];
};

export const ProductEntry: React.FC<ProductEntryProps> = ({
  showSuggestions = false,
  currentList,
  addProduct,
}) => {
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

    if (extractedProduct) {
      addProduct(
        {
          name: extractedProduct.name,
          quantity: extractedProduct.quantity || quantity,
          id: Date.now().toString(),
          value: price || 0,
          listId: currentList.id,
          checked: false,
        },
        currentList.id
      );
      resetFields();
    }
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
