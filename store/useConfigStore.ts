// store/useConfigStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

export const zustandStorage: PersistStorage<any> = {
  getItem: async (name) => {
    const value = await AsyncStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {    
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

type ConfigState = {
  language: string;
  currency: string;
  show_value: boolean;
  show_quantity: boolean;
  show_suggestions: boolean;
  show_total: boolean;
  order_by: string;
  theme: "light" | "dark";
  setConfig: (key: keyof Omit<ConfigState, "setConfig">, value: any) => void;
};

export const useConfigStore = create(
  persist<ConfigState>(
    (set) => ({
      language: "pt-BR",
      currency: "BRL",
      show_value: true,
      show_quantity: true,
      show_suggestions: true,
      order_by: "name",
      theme: "light",
      show_total: true,
      setConfig: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),
    {
      name: "app-settings", // chave no AsyncStorage
      storage: zustandStorage,
    }
  )
);
