import { create } from "zustand";
import { persist } from "zustand/middleware";

import { db } from "@/lib/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
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

const useCreateServerSynchronizerAndStart = (store: ListStore) => {
  useEffect(() => {
    console.log("faz o sync");

    // const sync = async () => {
    //   const docRef = doc(db, "lists", "111");
    //   await setDoc(docRef, { lists: store.lists }, { merge: true });
    //   console.log("🚀 Sincronizado com o servidor!");
    // };

    // sync();
  }, [store.lists]);

  useEffect(() => {
    const docRef = doc(db, "lists", "111");

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data?.lists) {
          store.sync(data.lists);

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

export const useGetLists = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ref = doc(db, "lists", "111");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data?.lists) {
          queryClient.setQueryData(["lists"], data.lists);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return useQuery({
    queryKey: ["lists"],
    queryFn: () => getLists(),
  });
};

const createList = async (list: List) => {
    mmkv.set("lists:state", JSON.stringify({ state: { lists: [...getLists(), list] } }));
}

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createList,
    onSuccess: () => {
        console.log("call");
        
      queryClient.invalidateQueries({
        queryKey: ["lists"],
      });
    }
  });
};

export const useShoppingListsStore = () => {
  const store = useListStore();

  useCreateServerSynchronizerAndStart(store);

  //   const listener = mmkv.addOnValueChangedListener((changedKey) => {
  //     const newValue = mmkv.getString(changedKey);
  //     console.log(`"${changedKey}" new value: ${newValue}`);
  //   });
  return store;
};
