import { db as SQLiteDB } from "@/database/initializeDatabase";
import { List, Product } from "@/database/useShoppingList";
import { db as FirebaseDB } from "@/lib/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";

async function findListById(id: string): Promise<List> {
  try {
    const querylist = "SELECT * FROM list WHERE id = $id";
    const qeryProducts = "SELECT * FROM product WHERE list_id = $id";

    const listResponse = await SQLiteDB.getFirstAsync<List>(querylist, {
      $id: id,
    });
    if (!listResponse) {
      throw new Error("List not found");
    }

    const productResponse = await SQLiteDB.getAllAsync<Product>(qeryProducts, {
      $id: id,
    });

    return {
      ...listResponse,
      products: productResponse,
    };
  } catch (error) {
    throw error;
  }
}

export const useGetListById = (id: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ref = doc(FirebaseDB, "shoppingList", id);

    const unsubscribe = onSnapshot(ref, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const list = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        } as List;
        

        // await syncStorage([list]); // se quiser salvar local
        queryClient.setQueryData(["list", id], list);
      } else {
        console.log("Documento não encontrado");
      }
    });

    return () => unsubscribe();
  }, []);

  return useQuery({
    queryKey: ["list", id],
    queryFn: () => findListById(id),
  });
};
