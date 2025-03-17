import { QuantitySelector } from "@/components/QuantitySelector";
import { ValueInput } from "@/components/ValueInput";
import {
  List,
  useAddProduct,
  useEditProduct,
} from "@/database/useShoppingList";
import {
  filterProductsInList,
  useFilteredProducts,
} from "@/hooks/useFilteredProducts";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
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
  const valueFinal = (value || 0) * quantity;
  return (
    <Animated.View
      entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
      style={styles.optionsContainer}
    >
      <ValueInput
        value={value}
        onChangeValue={onChangeValue}
        rightLabel={formatValue(valueFinal)}
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
  showSuggestions = false,
  currentList,
}) => {
  const currentListProducts = currentList?.products;
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

  const filterData = useFilteredProducts(product, PRODUCT_DATA);

  const findProductInList = (productName: string) => {
    const existingProduct = filterProductsInList(
      productName,
      currentListProducts
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
    <Sheet
      showSuggestions={showSuggestions}
      hiddenContent={
        <View
          style={{
            gap: 8,
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
        </View>
      }
    >
      <Input
        placeholder="10 Laranjas"
        value={product}
        onChangeText={setProduct}
        onActionClick={handleAddItem}
        cap="bottom"
      />
    </Sheet>
  );
};

type SheetProps = {
  children: React.ReactNode;
  hiddenContent?: React.ReactNode;
  showSuggestions?: boolean;
};

const Sheet: React.FC<SheetProps> = ({
  children,
  hiddenContent,
  showSuggestions = true,
}) => {
  const SHOW_SUGGESTIONS = showSuggestions;
  const OPEN_HEIGHT = 190;
  const CLOSED_HEIGHT = 100;
  const OPEN_HEIGHT_WITHOUT_SUGGESTIONS = 150;

  const height = useSharedValue(
    SHOW_SUGGESTIONS ? OPEN_HEIGHT : OPEN_HEIGHT_WITHOUT_SUGGESTIONS
  );
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = height.value - event.changeY;

      const clampedValue = Math.min(200, Math.max(60, offsetDelta));

      height.value = clampedValue;
      opacity.value = (clampedValue - 60) / (200 - 60);
    })
    .onFinalize(() => {
      if (height.value > (200 + CLOSED_HEIGHT) / 2) {
        height.value = withTiming(
          SHOW_SUGGESTIONS ? OPEN_HEIGHT : OPEN_HEIGHT_WITHOUT_SUGGESTIONS
        );
        opacity.value = withTiming(1);
      } else {
        height.value = withTiming(CLOSED_HEIGHT);
        opacity.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  const animatedOpacity = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={pan}>
        <Pressable style={styles.dragHandle}>
          <ThemedView colorName="background.3" style={styles.indicator} />
        </Pressable>
      </GestureDetector>

      <Animated.View style={[styles.hiddenContent, animatedOpacity]}>
        {hiddenContent}
      </Animated.View>

      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    justifyContent: "space-between",
    paddingBottom: 8,
    marginTop: -24,
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
    backgroundColor: "#5B5B5B",
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },

  hiddenContent: {
    position: "absolute",
    top: 32,
    gap: 8,
    width: "100%",
  },

  dragHandle: {
    alignItems: "center",
    gap: 8,
    padding: 8,
  },

  indicator: {
    height: 5,
    width: 100,
    borderRadius: 2,
  },
});
