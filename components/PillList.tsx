// Imports
import { Colors } from "@/constants/Colors";
import {
  Product,
  useCheckProduct,
  useDeleteProduct,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useConfigStore } from "@/store/useConfigStore";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  FadeInUp,
  interpolateColor,
  LinearTransition,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "./ui/ThemedText";

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
  const progress = useSharedValue(0);

  const threshold = 10;
  const maxDrag = 30;

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      const clampedX = Math.max(
        Math.min(event.translationX, maxDrag),
        -maxDrag
      );
      translateX.value = clampedX;

      progress.value = clampedX / maxDrag;
    })
    .onEnd(() => {
      if (translateX.value < -threshold) {
        translateX.value = withTiming(-100);
        runOnJS(onRemove)();
      } else if (translateX.value > threshold) {
        runOnJS(onCheck)();
        translateX.value = withTiming(0);
        progress.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
        progress.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} layout={LinearTransition}>
        <AnimatedPressable
          entering={FadeInUp.duration(200).easing(Easing.inOut(Easing.quad))}
          onPress={onCheck}
          onLongPress={onLongPress}
          hitSlop={0}
          onPressIn={() => {
            scale.value = withTiming(0.85);
          }}
          onPressOut={() => {
            scale.value = withTiming(1);
          }}
        >
          <ProductContent
            name={name}
            quantity={quantity}
            valueFormatted={valueFormatted}
            checked={checked}
            showQuantity={showQuantity}
            showValue={showValue}
            progress={progress}
          />
        </AnimatedPressable>
      </Animated.View>
    </GestureDetector>
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
  progress: SharedValue<number>;
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
  progress,
}) => {
  const bg = useThemeColor({}, checked ? "success" : "background.1");

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [-1, 0, 1],
      [Colors.dark.danger, bg, Colors.dark.success]
    );

    return { backgroundColor };
  });

  return (
    <Animated.View style={[styles.pill, style, animatedStyle]}>
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
    </Animated.View>
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
    <View style={styles.pillList}>
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
    </View>
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
    paddingRight: 48,
    paddingBottom: 8,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 13,
    height: 40,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueText: {
    fontSize: 12,
  },
});
