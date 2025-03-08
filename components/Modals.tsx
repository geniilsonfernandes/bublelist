import { useBackHandler } from "@/hooks/useBackHandler";
import { useModals } from "@/store/useModals";
import React from "react";
import { StyleSheet } from "react-native";
import { EditList } from "./modals/EditList";
import { Modal } from "./modals/Modal";
import { ProductEditEntry } from "./ProductEntry";

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
