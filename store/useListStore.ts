import { List } from "@/database/useShoppingList";
import { create } from "zustand";

type ListState = {
  list: Omit<List, "products">;
  setList: (list: Omit<List, "products">) => void;
};

export const useListStore = create<ListState>((set) => ({
  list: {} as List,
  setList: (list: Omit<List, "products">) => set({ list }),
}));