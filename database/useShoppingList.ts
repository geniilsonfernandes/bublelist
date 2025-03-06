import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as SQLite from "expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";

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

export function useShoppingList() {
  const database = useSQLiteContext();

  async function create(
    data: Omit<List, "id" | "products">
  ): Promise<Omit<List, "products">> {
    const statement = await database.prepareAsync(
      `INSERT INTO list (name, budget) VALUES ($name, $budget)`
    );

    try {
      const result = await statement.executeAsync({
        $name: data.name,
        $budget: data.budget || 0,
      });

      const insertedRowId = result.lastInsertRowId;

      return { ...data, id: insertedRowId.toString() };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function list(): Promise<List[]> {
    try {
      const query = "SELECT * FROM list";

      const response = await database.getAllAsync<List>(query);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function findById(id: string): Promise<List> {
    try {
      const querylist = "SELECT * FROM list WHERE id = $id";
      const qeryProducts = "SELECT * FROM product WHERE list_id = $id";

      const listResponse = await database.getFirstAsync<List>(querylist, {
        $id: id,
      });
      if (!listResponse) {
        throw new Error("List not found");
      }

      const productResponse = await database.getAllAsync<Product>(
        qeryProducts,
        {
          $id: id,
        }
      );

      return {
        ...listResponse,
        products: productResponse,
      };
    } catch (error) {
      throw error;
    }
  }

  async function addProduct(product: Omit<Product, "id">) {
    const statement = await database.prepareAsync(
      `INSERT INTO product (list_id, name, quantity, value, checked) VALUES ($list_id, $name, $quantity, $value, $checked)`
    );
    try {
      const result = await statement.executeAsync({
        $list_id: product.list_id,
        $name: product.name,
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

  async function removeProduct(id: string) {
    const statement = await database.prepareAsync(
      `DELETE FROM product WHERE id = $id`
    );
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
  async function updateProduct(product: Product) {
    const statement = await database.prepareAsync(
      `UPDATE product SET name = $name, quantity = $quantity, value = $value, checked = $checked WHERE id = $id`
    );
    try {
      const result = statement.executeAsync({
        $name: product.name,
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

  async function deleteList(id: string) {
    const deleteListStmt = await database.prepareAsync(
      "DELETE FROM list WHERE id = $id"
    );
    const deleteProductsStmt = await database.prepareAsync(
      "DELETE FROM product WHERE list_id = $id"
    );

    try {
      await database.withTransactionAsync(async () => {
        await deleteProductsStmt.executeAsync({ $id: id }); // Primeiro, remove os produtos
        await deleteListStmt.executeAsync({ $id: id }); // Depois, remove a lista
      });

      return true;
    } catch (error) {
      console.error("Erro ao deletar lista:", error);
      return false;
    } finally {
      await deleteListStmt.finalizeAsync();
      await deleteProductsStmt.finalizeAsync();
    }
  }

  return {
    create,
    addProduct,
    removeProduct,
    updateProduct,
    findById,
    list,
    deleteList,
  };
}

const db = SQLite.openDatabaseSync("tlist.db");

async function createList(
  data: Omit<List, "id" | "products">
): Promise<Omit<List, "products">> {
  const statement = await db.prepareAsync(
    `INSERT INTO list (name, budget) VALUES ($name, $budget)`
  );

  try {
    const result = await statement.executeAsync({
      $name: data.name,
      $budget: data.budget || 0,
    });

    const insertedRowId = result.lastInsertRowId;

    return { ...data, id: insertedRowId.toString() };
  } catch (error) {
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
  console.log(product);

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
  return useQuery({
    queryKey: ["list", id],
    queryFn: () => findListById(id),
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product: Omit<Product, "id">) => addProduct(product),
    onSuccess: () => {
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
