import { Product } from "@/database/useShoppingList";
import { create } from "zustand";




interface ModalsState {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  clearSelectedProduct: () => void;
}

export const useModals = create<ModalsState>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) =>
    set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));