import { QuantitySelector } from "@/components/QuantitySelector";
import { ThemedView } from "@/components/ThemedView";
import { ValueInput } from "@/components/ValueInput";
import {
  List,
  useAddProduct,
  useEditProduct,
} from "@/database/useShoppingList";
import useKeyboardVisibility from "@/hooks/useKeyboardVisibility";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
} from "react-native-reanimated";
import { Suggestions } from "./Suggestions";

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
  return (
    <Animated.View
      entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
      style={styles.optionsContainer}
    >
      <ValueInput value={value} onChangeValue={onChangeValue} />
      <QuantitySelector
        quantity={quantity}
        onChangeQuantity={onChangeQuantity}
      />
    </Animated.View>
  );
};

type ProductInputProps = {
  onActionClick: () => void;
} & TextInputProps;

export const ProductInput = forwardRef<TextInput, ProductInputProps>(
  ({ onActionClick, ...rest }, ref) => {
    const textColor = useThemeColor({}, "text");
    const placeholderTextColor = useThemeColor({}, "text.3");

    return (
      <ThemedView
        backgroundColor="background"
        borderColor="background.3"
        style={styles.createSheet}
      >
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref}
            placeholder="Digite o nome do produto"
            style={[styles.textInput, { color: textColor }]}
            placeholderTextColor={placeholderTextColor}
            {...rest}
          />
          {rest.value && (
            <Animated.View
              entering={FadeIn.delay(300)
                .duration(300)
                .easing(Easing.inOut(Easing.quad))}
              exiting={FadeOut.duration(300).easing(Easing.inOut(Easing.quad))}
            >
              <Pressable
                onPress={onActionClick}
                style={styles.addButton}
                disabled={!rest.value}
              >
                <Feather name="check" size={16} color="#DEDEDE" />
              </Pressable>
            </Animated.View>
          )}
        </View>
      </ThemedView>
    );
  }
);

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

      <ProductInput
        placeholder="Digite o nome do produto"
        ref={inputRef}
        value={product}
        onChangeText={setProduct}
        onActionClick={handleEditProduct}
      />
    </View>
  );
};

export const ProductEntry: React.FC<ProductEntryProps> = ({
  showSuggestions = true,
  currentList,
}) => {
  const { mutate } = useAddProduct();
  const isKeyboardVisible = useKeyboardVisibility();

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
    mutate(
      {
        list_id: currentList.id,
        name: product,
        quantity: quantity,
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

  // TODO: OPTIMIZE THIS
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
      {showSuggestions && (
        <Suggestions onSelect={findProductInList} suggestions={filterData} />
      )}

      {isKeyboardVisible && (
        <ProdutDetails
          value={value}
          quantity={quantity}
          onChangeQuantity={setQuantity}
          onChangeValue={setValue}
        />
      )}

      <ProductInput
        placeholder="Digite o nome do produto"
        value={product}
        onChangeText={setProduct}
        onActionClick={handleAddItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
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
