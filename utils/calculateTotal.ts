import { Product } from "@/database/useShoppingList";

export const calculateTotal = (products: Product[]) => {
  const total = products.reduce(
    (acc, product) => acc + (product.value || 0) * (product.quantity || 0),
    0
  );

  return total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
};
