import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";
import { initializeDatabase } from "./initializeDatabase";

export type List = {
  id: string;
  budget?: number;
  name: string;
  products: Product[];
};

export type Product = {
  id: string;
  list_id: string;
  checked: boolean;
  name: string;
  value: number;
  quantity: number;
};

const db = SQLite.openDatabaseSync("tlist.db");

initializeDatabase(db);

async function createList(
  data: Omit<List, "id" | "products">
): Promise<Omit<List, "products">> {
  const statement = await db.prepareAsync(
    `INSERT INTO list (name, budget) VALUES ($name, $budget)`
  );
  console.log(data);

  try {
    const result = await statement.executeAsync({
      $name: data.name,
      $budget: data.budget || 0,
    });

    const insertedRowId = result.lastInsertRowId;

    return { ...data, id: insertedRowId.toString() };
  } catch (error) {
    console.log(error);

    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function getList(): Promise<List[]> {
  try {
    const query = "SELECT * FROM list";
    let response: List[] = [];

    await db.withTransactionAsync(async () => {
      const lists = await db.getAllAsync<List>(query);
      const listWithProducts = await Promise.all(
        lists.map(async (list) => {
          const products = await db.getAllAsync<Product>(
            "SELECT * FROM product WHERE list_id = $id",
            {
              $id: list.id,
            }
          );
          return {
            ...list,
            products,
          };
        })
      );
      response = listWithProducts;
    });

    return response;
  } catch (error) {
    throw error;
  }
}

async function editList(data: Omit<List, "products">) {
  const statement = await db.prepareAsync(
    `UPDATE list SET name = $name, budget = $budget WHERE id = $id`
  );
  try {
    const result = await statement.executeAsync({
      $name: data.name,
      $budget: data.budget || 0,
      $id: data.id,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function deleteList(id: string) {
  const statement = await db.prepareAsync(`DELETE FROM list WHERE id = $id`);
  try {
    const result = await statement.executeAsync({
      $id: id,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function findListById(id: string): Promise<List> {
  try {
    const querylist = "SELECT * FROM list WHERE id = $id";
    const qeryProducts = "SELECT * FROM product WHERE list_id = $id";

    const listResponse = await db.getFirstAsync<List>(querylist, {
      $id: id,
    });
    if (!listResponse) {
      throw new Error("List not found");
    }

    const productResponse = await db.getAllAsync<Product>(qeryProducts, {
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

async function addProduct(product: Omit<Product, "id">) {
  const statement = await db.prepareAsync(
    `INSERT INTO product (list_id, name, quantity, value, checked) VALUES ($list_id, $name, $quantity, $value, $checked)`
  );

  try {
    const result = await statement.executeAsync({
      $list_id: product.list_id,
      $name: product.name.trim(),
      $quantity: product.quantity,
      $value: product.value,
      $checked: product.checked,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function checkProduct(product: Pick<Product, "id" | "checked">) {
  const statement = await db.prepareAsync(
    `UPDATE product SET checked = $checked WHERE id = $id`
  );
  try {
    const result = statement.executeAsync({
      $checked: product.checked,
      $id: product.id,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function editProduct(product: Product) {
  const statement = await db.prepareAsync(
    `UPDATE product SET name = $name, quantity = $quantity, value = $value, checked = $checked WHERE id = $id`
  );
  try {
    const result = statement.executeAsync({
      $name: product.name.trim(),
      $quantity: product.quantity,
      $value: product.value,
      $checked: product.checked,
      $id: product.id,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function deleteProduct(id: string) {
  const statement = await db.prepareAsync(`DELETE FROM product WHERE id = $id`);
  try {
    const result = statement.executeAsync({
      $id: id,
    });

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

async function deleteAllLists() {
  const statement = await db.prepareAsync(`DELETE FROM list`);
  try {
    const result = statement.executeAsync();

    return result;
  } catch (error) {
    throw error;
  } finally {
    await statement.finalizeAsync();
  }
}

export const useGetList = () => {
  return useQuery({
    queryKey: ["list"],
    queryFn: () => getList(),
  });
};

export const useCreateList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<List, "id" | "products">) => createList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useEditList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<List, "products">) => editList(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useGetListById = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["list", id],
    queryFn: () => findListById(id),
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, "id">) => addProduct(product),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useCheckProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Pick<Product, "id" | "checked">) =>
      checkProduct(product),
    onSuccess: () => {
      checkProduct;
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useEditProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Product) => editProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useDeleteList = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteList(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};

export const useDeleteAllLists = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllLists(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list"],
      });
    },
  });
};
