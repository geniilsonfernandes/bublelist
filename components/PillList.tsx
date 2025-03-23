import {
    Product,
    useCheckProduct,
    useDeleteProduct,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { useMemo } from "react";
import {
    Pressable,
    ScrollView,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Easing,
    FadeIn,
    FadeInUp,
    FadeOut,
    interpolateColor,
    LinearTransition,
    runOnJS,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { Icon } from "./ui/Icon";
import { ThemedText } from "./ui/ThemedText";

import { Colors } from "@/constants/Colors";
import Svg, { Path } from "react-native-svg";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

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
  const backgroundOpacity = useSharedValue(1);
  const progress = useSharedValue(0);

  const threshold = 10;
  const maxDrag = 30;

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(
        Math.min(event.translationX, maxDrag),
        -maxDrag
      );
      progress.value = Math.min(Math.max(event.translationX / 100, -1), 1);

      if (translateX.value < -threshold) {
        backgroundOpacity.value = withTiming(0.2);
      }
    })
    .onEnd(() => {
      if (translateX.value < -threshold) {
        translateX.value = withTiming(-100);
        runOnJS(onRemove)?.();
      } else if (translateX.value > threshold) {
        runOnJS(onCheck)?.();
        translateX.value = withTiming(0);
        backgroundOpacity.value = withTiming(1);
        progress.value = withTiming(0);
      } else {
        translateX.value = withTiming(0);
        backgroundOpacity.value = withTiming(1);
        progress.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyle} layout={LinearTransition}>
        <AnimatedPressable
          entering={FadeInUp.duration(200).easing(Easing.inOut(Easing.quad))}
          onPress={onCheck}
          
          onLongPress={onLongPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPressIn={() => {
            scale.value = withTiming(0.9);
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
            style={backgroundAnimatedStyle}
          />
        </AnimatedPressable>
      </Animated.View>
    </GestureDetector>
  );
};

type ProductContentProps = {
  name: string;
  quantity: number;
  valueFormatted?: string;
  checked: boolean;
  showQuantity: boolean;
  showValue: boolean;
  progress: SharedValue<number>;
  style: StyleProp<ViewStyle>;
};

const ProductContent: React.FC<ProductContentProps> = ({
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

    return {
      backgroundColor,
    };
  });

  return (
    <Animated.View style={[styles.pill, style, animatedStyle]}>
      <Animated.View
        entering={FadeIn.duration(200).easing(Easing.inOut(Easing.quad))}
        exiting={FadeOut.duration(200).easing(Easing.inOut(Easing.quad))}
        style={styles.iconContainer}
      >
        <Icon
          name={checked ? "check" : "circle"}
          size={16}
          colorName={checked ? "text.1" : "text.6"}
        />
      </Animated.View>

      <ThemedText colorName="text.1" type="defaultSemiBold">
        {name}
      </ThemedText>

      {quantity > 1 && showQuantity && (
        <ThemedText colorName="text" opacity={0.7} type="body">
          {quantity}
        </ThemedText>
      )}

      {valueFormatted && showValue && (
        <ThemedText
          colorName="text"
          style={styles.valueText}
          opacity={0.7}
          type="body"
        >
          {valueFormatted}
        </ThemedText>
      )}
    </Animated.View>
  );
};

type PillListProps = {
  ListEmptyComponent?: React.ReactNode;
  data: Product[];
};

export const PillList: React.FC<PillListProps> = ({ data }) => {
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: checkProduct } = useCheckProduct();
  const { setSelectedProduct } = useModals();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pillList}>
        {data.map((product) => (
          <ProductBullet
            key={product.id}
            {...product}
            onRemove={() => deleteProduct(product.id)}
            onCheck={() => {
              checkProduct({ id: product.id, checked: !product.checked });
            }}
            onLongPress={() => setSelectedProduct(product)}
            showQuantity
            showValue
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pillList: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 8,
    paddingRight: 10,
    height: 38,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontSize: 12,
  },
});
