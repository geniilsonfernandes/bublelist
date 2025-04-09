import { List } from "@/database/useShoppingList";
import { create } from "zustand";

type ListState = {
  setActiveList: (list: List | null) => void;
  activeList: List | null;
};

export const useActiveList = create<ListState>((set) => ({
  activeList: null,
  setActiveList: (list) => set({ activeList: list }),
}));