// Imports
import { Colors } from "@/constants/Colors";
import { useConfigStore } from "@/state/use-config-store";
import { useListStore } from "@/state/use-list-store";
import { Product, useProductsStore } from "@/state/use-products-store";
import { formatValue } from "@/utils/calculateTotal";
import dayjs from "dayjs";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  FadeInUp,
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
      colorName={checked ? "success" : "transparent"}
      borderColor={checked ? "success" : "background.1"}
      style={[styles.pill, style]}
    >
      <Checkbox
        pointerEvents="none"
        style={{
          borderRadius: 6,
          width: 16,
          height: 16,
          borderWidth: 1,
        }}
        value={checked}
        color={Colors.light.success}
      />
      <ThemedText
        colorName="text.1"
        type="body"
        lightColor={checked ? "#fff" : ""}
      >
        {name}
      </ThemedText>

      {quantity > 1 && showQuantity && (
        <ThemedText
          colorName="text"
          style={styles.valueText}
          opacity={0.7}
          type="defaultSemiBold"
          lightColor={checked ? "#fff" : ""}
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
          lightColor={checked ? "#fff" : ""}
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
  const [isReady, setIsReady] = useState(false);
  const { show_quantity, show_value } = useConfigStore();
  const { updateProduct } = useListStore();
  const { addToHistory } = useProductsStore();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
      }}
      onLayout={() => {
        setIsReady(true);
      }}
    >
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              position: "relative",
              marginHorizontal: 16,
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Checkbox
              style={{
                borderRadius: 8,
                width: 24,
                height: 24,
                borderWidth: 1,
                borderColor: Colors.light["gray.700"],
              }}
              value={item.checked}
              onValueChange={() => {
                updateProduct(item.id, {
                  checked: !item.checked,
                });
              }}
              color={Colors.light.success}
            />
            <ThemedText colorName="text.1" type="default">
              {item.name}
            </ThemedText>
          </View>
        )}
      /> */}
      {isReady ? (
        <ScrollView
          contentContainerStyle={styles.pillList}
          removeClippedSubviews={true}
          scrollEventThrottle={16}
        >
          {data.length === 0 && ListEmptyComponent}
          {data.map((product) => (
            <ProductBullet
              key={product.id}
              {...product}
              // onRemove={() => deleteProduct(product.id)}
              onCheck={() => {
                updateProduct(product.id, {
                  checked: !product.checked,
                });
                addToHistory({
                  ...product,
                  checked: !product.checked,
                  purchasedAt: !product.checked
                    ? dayjs().format("YYYY-MM-DD")
                    : undefined,
                });
              }}
              onLongPress={() => {
                router.push(
                  `/list/${product.listId}/product?query=${product.id}`
                );
              }}
              showQuantity={show_quantity}
              showValue={show_value}
            />
          ))}
        </ScrollView>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={"#FFF"} />
        </View>
      )}
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
    paddingVertical: 8,
    paddingBottom: 68,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 8,
    height: 30,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  valueText: {
    fontSize: 12,
  },
});
