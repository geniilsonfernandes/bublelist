import { db } from "@/lib/firebase";
import { storage } from "@/lib/storage";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export type List = {
  id: string;
  name: string;
  budget?: number;
};

const KEY = "lists:store";

export class ListsService {
  unsubscribe?: () => void;

  getLists = () => {
    const value = storage.getString(KEY);
    if (!value) return []; // Se não tiver nada, retorna array vazio
    const parsed = JSON.parse(value) as List[];
    return parsed;
  };

  saveList = async (list: List) => {
    storage.set(KEY, JSON.stringify([...this.getLists(), list]));

    const subcollectionRef = collection(db, "lists", "111", "lists");

    await addDoc(subcollectionRef, {
      ...list,
      createdAt: new Date(),
    });
  };

  removeList = async (listId: string) => {
    storage.set(
      KEY,
      JSON.stringify(this.getLists().filter((list) => list.id !== listId))
    );
    this.sync();
  };

  sync = async () => {
    const value = storage.getString(KEY);
    console.log("🔥 Tentando sincronizar...");

    if (value) {
      const lists: List[] = JSON.parse(value);

      const docRef = doc(db, "lists", "111");
      await setDoc(docRef, { lists }, { merge: true });
      console.log("🚀 Listas enviadas para o servidor!");
    }
  };

  updateState = (lits: List[]) => {
    storage.set(KEY, JSON.stringify(lits));
  };
}

export const listsService = new ListsService();
