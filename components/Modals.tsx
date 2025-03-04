import { useAppContext } from "@/context/AppProvider";
import React, { useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ProductEditEntry } from "./ProductEntry";

const EditModal = () => {
  const { selectedProduct: productSelected, clearSelectedProduct } =
    useAppContext();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (productSelected) {
          clearSelectedProduct();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [productSelected]);
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
      <TouchableWithoutFeedback onPress={clearSelectedProduct}>
        <View style={{ flex: 1 }}></View>
      </TouchableWithoutFeedback>
      <Animated.View style={styles.content}>
        <ProductEditEntry />
      </Animated.View>
    </Animated.View>
  );
};

const ListEditModal = () => {
  const { selectedProduct: productSelected, clearSelectedProduct } =
    useAppContext();
  return (
    <Animated.View entering={FadeInDown.duration(300)} style={styles.container}>
      <TouchableWithoutFeedback onPress={clearSelectedProduct}>
        <View style={{ flex: 1 }}></View>
      </TouchableWithoutFeedback>
      <Animated.View style={styles.content}>
        <ProductEditEntry />
      </Animated.View>
    </Animated.View>
  );
};

export const Modals = () => {
  const { selectedProduct } = useAppContext();

  return <>{selectedProduct && <EditModal />}</>;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.24)",
    zIndex: 100,
  },
  content: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingVertical: 16,
    paddingHorizontal: 16,

    zIndex: 101,
  },
});
