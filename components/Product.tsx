import { ThemedText } from "@/components/ThemedText";
import {
  Product as ProductType,
  useCheckProduct,
  useShoppingList,
} from "@/database/useShoppingList";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, { BounceIn, FadeIn } from "react-native-reanimated";
import { ThemedView } from "./ThemedView";

const DeleteAction = () => (
  <ThemedView backgroundColor="danger" style={styles.rightAction}>
    <Feather name="trash-2" size={18} color="white" />
  </ThemedView>
);

type ProductProps = {
  invalidateList?: () => void;
  onSelect?: () => void;
} & ProductType;

export const Product: React.FC<ProductProps> = React.memo(
  ({ id, name, quantity, checked, value, invalidateList, onSelect }) => {
    const { mutate } = useCheckProduct();
    const shoppingList = useShoppingList();
    const [isChecked, setIsChecked] = useState(checked);

    const checkedBorderColor = useThemeColor({}, "success");
    const uncheckedBorderColor = useThemeColor({}, "text.7");

    const toggleCheckStatus = useCallback(async () => {
      try {
        mutate({
          id,
          checked: !isChecked,
        });
        setIsChecked((prev) => !prev);
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
      }
    }, [id, isChecked]);

    const deleteProduct = useCallback(async () => {
      try {
        await shoppingList.removeProduct(id);
        invalidateList?.();
      } catch (error) {
        console.error("Erro ao remover produto:", error);
      }
    }, [id]);

    const handleSelect = useCallback(() => {
      // selectProduct(id);
    }, []);

    const formatValue = (value: number) => {
      if (!value) return "";
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    };

    const valueFormatted = formatValue(value * quantity);

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
                  name={isChecked ? "check" : "circle"}
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
