import { List } from "@/database/useShoppingList";
import { formatValue } from "@/utils/calculateTotal";
import { StyleSheet, View } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { QuantitySelector } from "./QuantitySelector";
import { Suggestions } from "./Suggestions";
import { Input } from "./ui/Input";
import { ThemedView } from "./ui/ThemedView";
import { ValueInput } from "./ValueInput";

type ProductDetailsProps = {
  price: number | null;
  quantity: number;
  onQuantityChange: (value: number) => void;
  onPriceChange: (value: number | null) => void;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  price,
  quantity,
  onQuantityChange,
  onPriceChange,
}) => {
  const totalPrice = (price || 0) * quantity;
  return (
    <Animated.View
      entering={FadeInDown.duration(200).easing(Easing.inOut(Easing.quad))}
      style={styles.detailsContainer}
    >
      <ValueInput
        value={price}
        onChangeValue={onPriceChange}
        rightLabel={formatValue(totalPrice)}
        style={{ flex: 1 }}
        size="sm"
      />
      <QuantitySelector
        quantity={quantity}
        size="sm"
        onChangeQuantity={onQuantityChange}
      />
    </Animated.View>
  );
};

type ProductInputProps = {
  showSuggestions?: boolean;
  currentList?: List;
  productName: string;
  setProductName: (value: string) => void;
  quantity: number;
  setQuantity: (value: number) => void;
  price: number | null;
  setPrice: (value: number | null) => void;
  handleAddProduct: () => void;
  suggestedProducts?: string[];
  selectSuggestedProduct?: (name: string) => void;
};

export const ProductInput: React.FC<ProductInputProps> = ({
  showSuggestions = false,
  productName,
  setProductName,
  quantity,
  setQuantity,
  price,
  setPrice,
  handleAddProduct,
  suggestedProducts = [],
  selectSuggestedProduct = () => {},
}) => {
  return (
    <ThemedView bg="background.1" style={styles.container}>
      {showSuggestions && productName && (
        <Suggestions
          onSelect={selectSuggestedProduct}
          suggestions={suggestedProducts}
        />
      )}

      <Input
        placeholder="Digite o nome do produto"
        value={productName}
        bg="background.1"
        onChangeText={setProductName}
        onActionClick={handleAddProduct}
        size="md"
      />
      <View style={styles.detailsWrapper}>
        <ProductDetails
          price={price}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onPriceChange={setPrice}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingTop: 8,
    borderTopEndRadius: 8,
    borderTopStartRadius: 8,
    paddingHorizontal: 8,
  },
  detailsWrapper: {
    paddingBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
});
