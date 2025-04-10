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
};

export type ProductsStore = {
  products: Product[];

  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
};

const KEY = "products:store";

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: [],
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
    }),
    {
      name: KEY, // chave que vai salvar no storage
      storage: zustandStorage,
    }
  )
);
