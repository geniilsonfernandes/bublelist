import { List, Product, useShoppingList } from "@/database/useShoppingList";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type Options = {
  onSuccess?: () => void;
  onError?: () => void;
};

// Definição do tipo do contexto
interface AppContextType {
  selectedProduct: Product | null;
  selectProduct: (id: string) => void;
  clearSelectedProduct: () => void;

  loadListById: (id: string) => Promise<void>;
  currentList: List | null;
  refreshList: () => Promise<void>;

  activeListId: string | null;
  addProductToList: (
    product: Omit<Product, "id" | "list_id">,
    options?: Options
  ) => Promise<void>;
  updateProductInList: (
    product: Omit<Product, "list_id">,
    options?: Options
  ) => Promise<void>;

  showListDetails: boolean;
  closeListDetails: (value: boolean) => void;
}

// Criando o contexto
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provedor do contexto
interface AppProviderProps {
  children: ReactNode;
}

const INITIAL_QUANTITY = 1;

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [showListDetails, setShowListDetails] = useState<boolean>(false);
  const [currentList, setCurrentList] = useState<List | null>(null);
  const shoppingList = useShoppingList();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const selectProduct = (id: string) => {
    setSelectedProduct(
      currentList?.products.find((product) => product.id === id) || null
    );
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
  };

  const loadListById = useCallback(async (id: string) => {
    setActiveListId(id);
    try {
      const response = await shoppingList.findById(id);

      if (response) {
        setCurrentList(response);
      }
    } catch (error) {
      console.error("Error loading list:", error);
    }
  }, []);

  const refreshList = async () => {
    if (activeListId) {
      await loadListById(activeListId);
    }
  };

  const checkIfProductExists = (name: string): Product | undefined => {
    if (!currentList) return undefined;
    return currentList.products.find(
      (product) => product.name.toLocaleLowerCase() === name.toLocaleLowerCase()
    );
  };

  const addProductToList = async (
    product: Omit<Product, "id" | "list_id">,
    options?: Options
  ) => {
    const { onSuccess, onError } = options || {};
    if (!activeListId) return;

    const productExists = checkIfProductExists(product.name);
    if (productExists) {
      updateProductInList(
        {
          ...product,
          id: productExists.id,
        },
        options
      );
      return;
    }
    try {
      shoppingList.addProduct({
        list_id: activeListId,
        name: product.name,
        quantity: product.quantity || INITIAL_QUANTITY,
        value: product.value || 0,
        checked: false,
      });
      refreshList();
      onSuccess?.();
    } catch (error) {
      console.error("Error adding product:", error);
      onError?.();
    }
  };

  const updateProductInList = async (
    product: Omit<Product, "list_id">,
    options?: Options
  ) => {
    const { onSuccess, onError } = options || {};
    if (!activeListId) return;
    try {
      shoppingList.updateProduct({
        ...product,
        list_id: activeListId,
      });
      refreshList();
      onSuccess?.();
    } catch (error) {
      console.error("Error updating product:", error);
      onError?.();
    }
  };

  const openListDetails = (id: string) => {
    setShowListDetails(true);
  }

  const closeListDetails = () => {
    setShowListDetails(false);
  }


  return (
    <AppContext.Provider
      value={{
        selectedProduct,
        selectProduct,
        clearSelectedProduct,

        loadListById,
        currentList,
        refreshList,
        addProductToList,
        updateProductInList,
        activeListId,

        showListDetails,
        closeListDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
