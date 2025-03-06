import { List, Product } from "@/database/useShoppingList";
import { create } from "zustand";

interface ModalsState {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  clearSelectedProduct: () => void;

  selectedList: List | null;
  setSelectedList: (list: List | null) => void;
  clearSelectedList: () => void;
}

export const useModals = create<ModalsState>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  selectedList: null,
  setSelectedList: (list) => set({ selectedList: list }),
  clearSelectedList: () => set({ selectedList: null }),
}));
