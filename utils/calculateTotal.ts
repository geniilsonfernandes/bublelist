import { Product } from "@/database/useShoppingList";

export const formatValue = (value: number) => {
  if (!value) return "";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const calculateTotal = (products: Product[]) => {
  const total = products.reduce((acc, product) => {
    return acc + (product.value || 0) * (product.quantity || 0);
  }, 0);

  return formatValue(total);
};
