import { storage } from "@/lib/storage";
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
  create: (list: List) => void;
  remove: (listId: string) => void;
  update: (listId: string, updates: Partial<List>) => void;
  addProduct: (product: Product, listId: string) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
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
      // onRehydrateStorage: () => {},
      // merge: (persistedState, currentState) => ({
      //   ...persistedState,
      //   ...currentState,
      // }),
      // skipHydration: true,
      // migrate: (persistedState, currentState) => ({
      //   ...persistedState,
      //   ...currentState,
      // }),
      storage: {
        getItem: (name) => {
          const value = storage.getString(name);
          try {
            return value ? JSON.parse(value) : null;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      },
    }
  )
);

console.log(useListStore.getState());

// tranform list into array
export const useLists = () => Object.values(useListStore.getState().lists);

export const useFindListById = (id: string) => {
  return useListStore((state) => state.lists[id]);
};
