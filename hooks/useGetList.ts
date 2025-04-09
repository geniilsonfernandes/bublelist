import { create } from "zustand";
import { persist } from "zustand/middleware";

import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useRef } from "react";
import { MMKV } from "react-native-mmkv";

const mmkv = new MMKV();

type List = {
  id: string;
  name: string;
};

type ListStore = {
  lists: List[];

  create: (list: List) => void;
  remove: (listId: string) => void;
  update: (listId: string, updates: Partial<List>) => void;

  setLists: (lists: List[]) => void;
  sync: (lists: List[]) => void;
};

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      lists: [],

      create: (list) => set({ lists: [...get().lists, list] }),

      remove: (listId) =>
        set({ lists: get().lists.filter((list) => list.id !== listId) }),

      update: (listId, updates) =>
        set({
          lists: get().lists.map((list) =>
            list.id === listId ? { ...list, ...updates } : list
          ),
        }),

      setLists: (lists) => set({ lists }),

      sync: (lists) => set({ lists }),
    }),
    {
      name: "lists", // chave que vai salvar no storage
      storage: {
        getItem: (name) => {
          const value = mmkv.getString(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          mmkv.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          mmkv.delete(name);
        },
      },
    }
  )
);

export const useCreateServerSynchronizerAndStart = (lists: List[]) => {
  const serverListsRef = useRef<List[] | null>(null);

  useEffect(() => {
    const docRef = doc(db, "lists", "111");

    const interval = setInterval(async () => {
      try {
        console.log("⏰ Tentando sincronizar a cada 30s...");
        await setDoc(docRef, { lists }, { merge: true });
        console.log("🚀 Listas enviadas para o servidor!");
      } catch (error) {
        console.error("❌ Erro ao sincronizar:", error);
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [lists]); // depende de lists

  useEffect(() => {
    const docRef = doc(db, "lists", "111");

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data?.lists) {
          serverListsRef.current = data.lists;
          saveLists(data.lists);
          console.log("🔥 Atualizado pelo servidor!");
        }
      }
    });

    return () => unsubscribe();
  }, []);
};

const getLists = () => {
  const value = mmkv.getString("lists:state");
  if (!value) return []; // Se não tiver nada, retorna array vazio
  const parsed = JSON.parse(value) as { state: { lists: List[] } };
  return parsed.state.lists; // porque o persist salva assim
};

const createList = async (list: List) => {
  mmkv.set(
    "lists:state",
    JSON.stringify({ state: { lists: [...getLists(), list] } })
  );
};

const saveLists = async (lists: List[]) => {
  mmkv.set("lists:state", JSON.stringify({ state: { lists } }));
};

export const useShoppingListsStore = () => {
  const store = useListStore();

  return store;
};
