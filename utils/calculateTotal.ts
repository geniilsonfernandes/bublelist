import { Product } from "@/state/use-products-store";

export const formatValue = (value: number) => {
  if (!value) return "0";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const calculateTotal = (products: Product[]) => {
  const total = products.reduce((acc, product) => {
    if (!product.value || !product.quantity || !product.checked) return acc;

    const sum = product.value * product.quantity;
    return acc + sum;
  }, 0);

  return total;
};
