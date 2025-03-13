import { QuantitySelector } from "@/components/QuantitySelector";
import { ValueInput } from "@/components/ValueInput";
import {
  List,
  useAddProduct,
  useEditProduct,
} from "@/database/useShoppingList";
import { useModals } from "@/store/useModals";
import * as Haptics from "expo-haptics";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { Suggestions } from "./Suggestions";
import { Input } from "./ui/Input";
import { ThemedView } from "./ui/ThemedView";

const PRODUCT_DATA = [
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

function extractNumber(text: string): number | null {
  const match = text.match(/(\d+)\s*\S+/);
  return match ? parseInt(match[1], 10) : null;
}

const INITIAL_QUANTITY = 1;

type ProductEntryProps = {
  showSuggestions?: boolean;
  currentList?: List;
};

type ProductEntryData = {
  onChangeValue: (value: number | null) => void;
  value: number | null;
  quantity: number;
  onChangeQuantity: (value: number) => void;
};

const ProdutDetails: React.FC<ProductEntryData> = ({
  value,
  quantity,
  onChangeQuantity,
  onChangeValue,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
      style={styles.optionsContainer}
    >
      <ValueInput
        value={value}
        onChangeValue={onChangeValue}
        style={{
          flex: 1,
        }}
        cap="top"
      />

      <QuantitySelector
        quantity={quantity}
        onChangeQuantity={onChangeQuantity}
      />
    </Animated.View>
  );
};

export const ProductEditEntry = () => {
  const { setSelectedProduct, selectedProduct } = useModals();
  const { mutate } = useEditProduct();
  const inputRef = useRef<TextInput | null>(null);

  const [product, setProduct] = useState(selectedProduct?.name || "");
  const [quantity, setQuantity] = useState(selectedProduct?.quantity || 1);
  const [value, setValue] = useState<number | null>(
    selectedProduct?.value || null
  );

  const handleEditProduct = () => {
    if (selectedProduct) {
      mutate(
        {
          ...selectedProduct,
          name: product,
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

  useEffect(() => {
    if (selectedProduct) {
      inputRef.current?.focus();
    }
  }, [selectedProduct]);

  return (
    <View style={styles.container}>
      {selectedProduct && (
        <Suggestions onSelect={() => {}} suggestions={[selectedProduct.name]} />
      )}

      <ProdutDetails
        value={value}
        quantity={quantity}
        onChangeQuantity={setQuantity}
        onChangeValue={setValue}
      />

      <Input
        placeholder="Digite o nome do produto"
        ref={inputRef}
        value={product}
        onChangeText={setProduct}
        onActionClick={handleEditProduct}
      />
    </View>
  );
};

function extractNumberAndClean(text: string): {
  name: string;
  quantity: number | null;
} {
  // Match number at the start of the string
  const matchStart = text.match(/^(\d+)\s*(\S.*)/);
  // Match number at the end of the string
  const matchEnd = text.match(/(\S.*)\s*(\d+)$/);

  if (matchStart) {
    return {
      name: matchStart[2], // The remaining part after the number at the start
      quantity: parseInt(matchStart[1], 10), // The number at the start
    };
  } else if (matchEnd) {
    return {
      name: matchEnd[1], // The remaining part before the number at the end
      quantity: parseInt(matchEnd[2], 10), // The number at the end
    };
  }

  // If no valid number is found, return the original string and null for quantity
  return { name: text, quantity: null };
}

export const ProductEntry: React.FC<ProductEntryProps> = ({
  showSuggestions = true,
  currentList,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const { mutate } = useAddProduct();

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(INITIAL_QUANTITY);
  const [value, setValue] = useState<number | null>(null);

  const clearProduct = () => {
    setProduct("");
    setQuantity(INITIAL_QUANTITY);
    setValue(null);
  };

  const handleAddItem = () => {
    if (currentList?.id === undefined) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const extracted = extractNumberAndClean(product);
    console.log(extracted);

    mutate(
      {
        list_id: currentList.id,
        name: extracted.name,
        quantity: extracted.quantity || quantity,
        value: value || 0,
        checked: false,
      },
      {
        onSuccess: () => {
          clearProduct();
        },
      }
    );
  };

  const filterData = useMemo(
    () =>
      product
        ? PRODUCT_DATA.filter((item) =>
            item.toLowerCase().includes(product.toLowerCase())
          )
        : PRODUCT_DATA.slice(0, 10),
    [product]
  );

  const findProductInList = (productName: string) => {
    const existingProduct = currentList?.products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (existingProduct) {
      setProduct(existingProduct.name);
      setQuantity(existingProduct.quantity);
      setValue(existingProduct.value);
    } else {
      setProduct(productName);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setShowDetails(!showDetails);
        }}
        style={{
          alignItems: "center",
          gap: 8,
        }}
      >
        <ThemedView
          colorName="background.3"
          style={{
            height: 5,
            width: 100,
            borderRadius: 2,
            marginBottom: 8,
          }}
        />
      </Pressable>
      {showDetails && (
        <Animated.View
          entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
          exiting={FadeOutDown.duration(200).easing(Easing.inOut(Easing.quad))}
          style={{
            gap: 4,
          }}
        >
          {showSuggestions && (
            <Suggestions
              onSelect={findProductInList}
              suggestions={filterData}
            />
          )}

          <ProdutDetails
            value={value}
            quantity={quantity}
            onChangeQuantity={setQuantity}
            onChangeValue={setValue}
          />
        </Animated.View>
      )}

      <Input
        placeholder="10 Laranjas"
        value={product}
        onChangeText={setProduct}
        onActionClick={handleAddItem}
        cap="bottom"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  createSheet: {
    width: "100%",
    padding: 8,
    borderRadius: 16,
  },
  addButton: {
    padding: 8,
    backgroundColor: "#5B5B5B",
    borderRadius: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  textInput: {
    flex: 1,
    height: 38,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
});
