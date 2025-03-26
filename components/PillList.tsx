// Imports
import {
  Product,
  useCheckProduct,
  useDeleteProduct,
} from "@/database/useShoppingList";
import { useConfigStore } from "@/store/useConfigStore";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ui/ThemedText";
import { ThemedView } from "./ui/ThemedView";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ProductBullet Component
type ProductProps = {
  onCheck?: () => void;
  onRemove?: () => void;
  onLongPress?: () => void;
  showQuantity?: boolean;
  showValue?: boolean;
} & Product;

export const ProductBullet: React.FC<ProductProps> = ({
  name,
  quantity,
  value,
  checked,
  onCheck = () => {},
  onRemove = () => {},
  showQuantity = false,
  showValue = false,
  onLongPress,
}) => {
  const valueFormatted = useMemo(() => {
    if (!value) return;
    return formatValue(value * quantity);
  }, [value, quantity]);

  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "relative",
        },
      ]}
      layout={LinearTransition}
    >
      <AnimatedPressable
        entering={FadeInUp.duration(200).easing(Easing.inOut(Easing.quad))}
        onPress={onCheck}
        onLongPress={onLongPress}
        hitSlop={0}
        onPressIn={() => {
          scale.value = withTiming(0.95);
        }}
        onPressOut={() => {
          scale.value = withTiming(1);
        }}
        style={animatedStyle}
      >
        <ProductContent
          name={name}
          quantity={quantity}
          valueFormatted={valueFormatted}
          checked={checked}
          showQuantity={showQuantity}
          showValue={showValue}
        />
      </AnimatedPressable>
    </Animated.View>
  );
};

// ProductContent Component
type ProductContentProps = {
  name: string;
  quantity: number;
  valueFormatted?: string;
  checked: boolean;
  showQuantity: boolean;
  showValue: boolean;
  style?: StyleProp<ViewStyle>;
};

export const ProductContent: React.FC<ProductContentProps> = ({
  name,
  quantity,
  valueFormatted,
  checked,
  showQuantity,
  showValue,
  style,
}) => {
  return (
    <ThemedView
      colorName={checked ? "success" : "background.1"}
      style={[styles.pill, style]}
    >
      <ThemedText colorName="text.1" type="defaultSemiBold">
        {name}
      </ThemedText>

      {quantity > 1 && showQuantity && (
        <ThemedText
          colorName="text"
          style={styles.valueText}
          opacity={0.7}
          type="defaultSemiBold"
        >
          {quantity}
        </ThemedText>
      )}

      {valueFormatted && showValue && (
        <ThemedText
          colorName="text"
          style={styles.valueText}
          type="defaultSemiBold"
          opacity={0.7}
        >
          {valueFormatted}
        </ThemedText>
      )}
    </ThemedView>
  );
};

// PillList Component
type PillListProps = {
  ListEmptyComponent?: React.ReactNode;
  data: Product[];
};

export const PillList: React.FC<PillListProps> = ({
  data,
  ListEmptyComponent,
}) => {
  const { show_quantity, show_value } = useConfigStore();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: checkProduct } = useCheckProduct();
  const { setSelectedProduct } = useModals();

  return (
    <ScrollView
      contentContainerStyle={styles.pillList}
      removeClippedSubviews={true}
    >
      {data.length === 0 && ListEmptyComponent}
      {data.map((product) => (
        <ProductBullet
          key={product.id}
          {...product}
          onRemove={() => deleteProduct(product.id)}
          onCheck={() =>
            checkProduct({ id: product.id, checked: !product.checked })
          }
          onLongPress={() => setSelectedProduct(product)}
          showQuantity={show_quantity}
          showValue={show_value}
        />
      ))}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "red",
  },
  pillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 10,
  },
  pill: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueText: {
    fontSize: 12,
  },
});
