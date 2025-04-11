import { List } from "@/state/use-list-store";
import { formatValue } from "@/utils/calculateTotal";
import { StyleSheet, View } from "react-native";
import { QuantitySelector } from "./QuantitySelector";
import { Suggestions } from "./Suggestions";
import { Input } from "./ui/Input";
import { ThemedView } from "./ui/ThemedView";
import { ValueInput } from "./ValueInput";

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
        pl={4}
      />
      <View style={styles.detailsContainer}>
        <ValueInput
          value={price}
          onChangeValue={setPrice}
          rightLabel={formatValue(price || 0)}
          size="sm"
          style={{
            flexGrow: 1,
          }}
        />
        <QuantitySelector
          quantity={quantity}
          size="sm"
          onChangeQuantity={setQuantity}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
    paddingTop: 8,
    borderRadius: 8,
    paddingHorizontal: 4,
    marginHorizontal: 8,
    marginBottom: 8,
    paddingBottom: 4,
  },
  detailsWrapper: {
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
