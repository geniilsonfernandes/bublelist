import { zustandStorage } from "@/lib/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "./use-products-store";

export type List = {
  id: string;
  name: string;
  budget?: number;
  products?: Product[];
};

export type ListStore = {
  lists: Record<string, List>; // 👈 mudou aqui
  activeListId?: string; // 👈 guarda só o id
  setActiveList: (listId: string) => void;
  getList: (listId: string) => List;
  create: (list: List) => void;
  remove: (listId: string) => void;
  update: (listId: string, updates: Partial<List>) => void;
  addProduct: (product: Product, listId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  removeProduct: (productId: string) => void;

  clear: () => void;
};

const KEY = "lists:store:v1";

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      lists: {},
      activeListId: undefined,

      create: (list) =>
        set((state) => ({
          lists: { ...state.lists, [list.id]: list },
        })),

      remove: (listId) =>
        set((state) => {
          const { [listId]: removed, ...rest } = state.lists;
          return { lists: rest };
        }),

      update: (listId, updates) =>
        set((state) => ({
          lists: {
            ...state.lists,
            [listId]: { ...state.lists[listId], ...updates },
          },
        })),

      getList: (listId) => {
        return get().lists[listId];
      },

      setActiveList: (listId) => set({ activeListId: listId }),

      addProduct: (product, listId) =>
        set((state) => {
          const list = state.lists[listId];
          if (!list) return {};

          const products = list.products || [];
          return {
            lists: {
              ...state.lists,
              [listId]: { ...list, products: [...products, product] },
            },
          };
        }),

      clear: () => set({ lists: {}, activeListId: undefined }),

      removeProduct: (productId) => {
        return set((state) => {
          const activeListId = state.activeListId;
          if (!activeListId) {
            return {};
          }

          const list = state.lists[activeListId];
          if (!list) {
            console.log("Nenhuma lista encontrada");
            return {};
          }

          const updatedProducts = list.products?.filter(
            (p) => p.id !== productId
          );

          return {
            lists: {
              ...state.lists,
              [activeListId]: {
                ...list,
                products: updatedProducts,
              },
            },
          };
        });
      },

      updateProduct: (productId, updates) =>
        set((state) => {
          const activeListId = state.activeListId;
          if (!activeListId) {
            console.log("Sem lista ativa");

            return {};
          }

          const list = state.lists[activeListId];
          if (!list) {
            console.log("Nenhuma lista encontrada");
            return {};
          }

          const updatedProducts = list.products?.map((p) =>
            p.id === productId ? { ...p, ...updates } : p
          );

          return {
            lists: {
              ...state.lists,
              [activeListId]: {
                ...list,
                products: updatedProducts,
              },
            },
          };
        }),
    }),
    {
      name: KEY,
      storage: zustandStorage,
    }
  )
);

export const useLists = () => Object.values(useListStore.getState().lists);

export const useGetProductById = (id: string, listId: string) => {
  return useListStore((state) =>
    state.lists[listId]?.products?.find((p) => p.id === id)
  );
};
export const useFindListById = (id: string) => {
  return useListStore((state) => state.lists[id]);
};
