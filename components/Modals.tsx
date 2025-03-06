import { useBackHandler } from "@/hooks/useBackHandler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useModals } from "@/store/useModals";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { EditList } from "./modals/EditList";
import { ProductEditEntry } from "./ProductEntry";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const background = useThemeColor({}, "background");

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutDown.duration(300)}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <LinearGradient
          // Background Linear Gradient
          colors={["transparent", background]}
          end={{ x: 0.3, y: 0.6 }}
          style={{
            flex: 1,
          }}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={styles.content}>{children}</Animated.View>
    </Animated.View>
  );
};

const EditModal = () => {
  const { clearSelectedProduct, selectedProduct } = useModals();

  useBackHandler({
    condition: !!selectedProduct,
    onBackPress: clearSelectedProduct,
  });

  return (
    <Modal onClose={() => clearSelectedProduct()}>
      <ProductEditEntry />
    </Modal>
  );
};

export const Modals = () => {
  const { selectedProduct, selectedList } = useModals();

  return (
    <>
      {selectedProduct && <EditModal />}
      {selectedList && <EditList />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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

  fill: {
    backgroundColor: "#4E4E4E",
    height: 48,
    borderRadius: 8,
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  outline: {
    backgroundColor: "transparent",
    height: 48,
    borderRadius: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  budgetContainer: { marginTop: 16 },
  createButtonText: { color: "#dddddd", fontSize: 16, fontWeight: "500" },
});
