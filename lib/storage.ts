import { MMKV } from "react-native-mmkv";
import { PersistStorage } from "zustand/middleware";

export const storage = new MMKV();

export const zustandStorage: PersistStorage<any> = {
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
};
