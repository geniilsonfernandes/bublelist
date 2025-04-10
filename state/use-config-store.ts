// store/useConfigStore.ts
import { storage } from "@/lib/storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";



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

const KEY = "config";

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
      name: KEY,
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
