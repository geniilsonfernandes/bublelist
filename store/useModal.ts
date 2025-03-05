import { create } from "zustand";

interface ModalState {
  selectedProduct: string | null;
  setSelectedProduct: (product: string) => void;
  clearSelectedProduct: () => void;
}

export const useModal = create<ModalState>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product: string) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),   
}))