import { useAppContext } from "@/context/AppProvider";
import { useModals } from "@/store/useModals";
import React, { useEffect } from "react";
import {
  BackHandler,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { ProductEditEntry } from "./ProductEntry";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }}></View>
      </TouchableWithoutFeedback>
      <Animated.View style={styles.content}>{children}</Animated.View>
    </Animated.View>
  );
};

const EditModal = () => {
  const { setSelectedProduct, selectedProduct } = useModals();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (selectedProduct) {
          setSelectedProduct(null);
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [selectedProduct]);
  return (
    <Modal onClose={() => setSelectedProduct(null)}>
      <ProductEditEntry />
    </Modal>
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
  const { selectedProduct } = useModals();

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
