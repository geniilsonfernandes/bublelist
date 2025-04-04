import { ThemedText } from "@/components/ui/ThemedText";
import {
  Product as ProductType,
  useCheckProduct,
  useDeleteProduct,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  BounceIn,
  FadeIn,
  SharedValue,
} from "react-native-reanimated";
import { ThemedView } from "./ui/ThemedView";

const DeleteAction = ({ progress }: { progress: SharedValue<number> }) => {
  return (
    <ThemedView backgroundColor="danger" style={styles.rightAction}>
      <Feather name="trash-2" size={18} color="white" />
    </ThemedView>
  );
};

type ProductProps = {
  onSelect?: () => void;
  onRemove?: () => void;
} & ProductType;

export const Product: React.FC<ProductProps> = React.memo(
  ({ id, name, quantity, checked, value, list_id, onRemove }) => {
    const { mutate: checkProduct } = useCheckProduct();
    const { mutate: deleteProduct } = useDeleteProduct();
    const { setSelectedProduct } = useModals();
    const [isChecked, setIsChecked] = useState(checked);
    const checkedBorderColor = useThemeColor({}, "success");
    const uncheckedBorderColor = useThemeColor({}, "text.7");

    const toggleCheckStatus = useCallback(() => {
      checkProduct({
        id,
        checked: !isChecked,
      });
      setIsChecked((prev) => !prev);
    }, [id, isChecked]);

    const handledeleteProduct = useCallback(() => {
      deleteProduct(id);
      onRemove?.();
    }, [id]);

    const handleSelect = () => {
      setSelectedProduct({
        id,
        name,
        quantity,
        value,
        checked,
        list_id,
      });
    };

    const valueFormatted = useMemo(() => {
      return formatValue(value * quantity);
    }, [value]);

    return (
      <ReanimatedSwipeable
        friction={2}
        enableTrackpadTwoFingerGesture
        leftThreshold={0}
        rightThreshold={100}
        onSwipeableWillOpen={handledeleteProduct}
        renderRightActions={(progressAnimatedValue) => (
          <DeleteAction progress={progressAnimatedValue} />
        )}
      >
        <Pressable
          onPress={handleSelect}
          android_ripple={{
            color: "#E6E6E610",
            foreground: true,
          }}
        >
          <ThemedView backgroundColor="background" style={styles.container}>
            <Pressable
              style={[
                styles.check,
                {
                  borderColor: isChecked
                    ? checkedBorderColor
                    : uncheckedBorderColor,
                  backgroundColor: isChecked
                    ? checkedBorderColor
                    : "transparent",
                },
              ]}
              onPress={toggleCheckStatus}
            >
              <Animated.View
                entering={
                  isChecked ? BounceIn.duration(300) : FadeIn.duration(300)
                }
              >
                {isChecked ? (
                  <Feather name="check" size={16} color="#fff" />
                ) : null}
              </Animated.View>
            </Pressable>
            <ThemedText
              colorName="text.1"
              type="body"
              style={[
                styles.productText,
                isChecked && styles.productTextChecked,
              ]}
            >
              {name}
            </ThemedText>
            <ThemedText colorName="text.3" type="body">
              {quantity > 1 ? `${quantity}` : ""}
            </ThemedText>
            <ThemedText colorName="text.3" type="body">
              {valueFormatted}
            </ThemedText>
          </ThemedView>
        </Pressable>
      </ReanimatedSwipeable>
    );
  }
);

export const ProductBullet: React.FC<ProductProps> = ({
  name,
  quantity,
  value,
  checked,
}) => {
  const valueFormatted = useMemo(() => {
    return formatValue(value * quantity);
  }, [value]);
  return (
    <ThemedView
      backgroundColor={checked ? "success" : "background.1"}
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
      }}
    >
      <ThemedText colorName="text.1" type="defaultSemiBold">
        {name}
      </ThemedText>
      {quantity > 1 ? (
        <ThemedText colorName="text" opacity={0.7} type="body">
          {quantity > 1 ? `${quantity}` : ""}
        </ThemedText>
      ) : null}
      {valueFormatted ? (
        <ThemedText colorName="text" opacity={0.7} type="body">
          {valueFormatted}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    height: 50,
    paddingHorizontal: 16,
  },
  check: {
    height: 28,
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  productText: {
    flex: 1,
    fontSize: 16,
  },
  productTextChecked: {
    textDecorationLine: "line-through",
    opacity: 0.5,
  },
  rightAction: {
    justifyContent: "center",
    paddingHorizontal: 16,
    alignItems: "flex-end",
    width: 180,
    height: "100%",
  },
});
