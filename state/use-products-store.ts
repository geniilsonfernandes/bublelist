import { zustandStorage } from "@/lib/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Product = {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  value: number;
  listId: string;
  purchasedAt?: string; // Data e hora da compra
};

export type ProductsStore = {
  products: Product[];

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;

  history: Product[]; // chave é a data
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
};

const KEY = "products:store:v1";

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
      history: [],

      addProduct: (product) => set({ products: [...get().products, product] }),

      removeProduct: (productId) =>
        set({
          products: get().products.filter(
            (product) => product.id !== productId
          ),
        }),

      updateProduct: (productId, updates) =>
        set({
          products: get().products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
          ),
        }),

      clearHistory: () => set({ history: [] }),

      addToHistory: (product) => {
        const findIndex = get().history.findIndex(
          (item) => item.id === product.id
        );

        if (findIndex !== -1) {
          const updatedHistory = [...get().history];
          updatedHistory[findIndex] = product;
          set({ history: updatedHistory });
        } else {
          set({ history: [...get().history, product] });
        }
      },
    }),
    {
      name: KEY,
      storage: zustandStorage,
    }
  )
);
