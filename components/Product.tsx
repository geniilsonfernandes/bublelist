import { ThemedText } from "@/components/ui/ThemedText";
import {
  Product as ProductType,
  useCheckProduct,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { formatValue } from "@/utils/calculateTotal";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { BounceIn, FadeIn } from "react-native-reanimated";
import { ThemedView } from "./ui/ThemedView";

const DeleteAction = () => (
  <ThemedView backgroundColor="danger" style={styles.rightAction}>
    <Feather name="trash-2" size={18} color="white" />
  </ThemedView>
);

type ProductProps = {
  onSelect?: () => void;
} & ProductType;

export const Product: React.FC<ProductProps> = React.memo(
  ({ id, name, quantity, checked, value, list_id }) => {
    const { mutate } = useCheckProduct();
    const { setSelectedProduct } = useModals();

    const [isChecked, setIsChecked] = useState(checked);
    const checkedBorderColor = useThemeColor({}, "success");
    const uncheckedBorderColor = useThemeColor({}, "text.7");

    const toggleCheckStatus = useCallback(() => {
      mutate({
        id,
        checked: !isChecked,
      });
      setIsChecked((prev) => !prev);
    }, [id, isChecked]);

    const deleteProduct = useCallback(() => {}, [id]);

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
        onSwipeableWillOpen={deleteProduct}
        renderRightActions={() => <DeleteAction />}
      >
        <Pressable onPress={handleSelect}>
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
                <Feather
                  name={isChecked ? "check" : "x"}
                  size={16}
                  color="#fff"
                />
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

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
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
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 16,
    alignItems: "center",
    width: 80,
    height: "100%",
  },
});
