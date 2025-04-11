import { Product } from "@/state/use-products-store";

export const formatValue = (value: number) => {
  if (!value) return "R$ 0,00";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const calculateTotal = (
  products: Product[],
  config: "checked" | "all" = "checked"
) => {
  const total = products.reduce((acc, product) => {
    if (config === "all") {
      if (!product.value || !product.quantity) return acc;
      const sum = product.value * product.quantity;
      return acc + sum;
    }

    if (
      !product.value ||
      !product.quantity ||
      (!product.checked && config === "checked")
    )
      return acc;

    const sum = product.value * product.quantity;
    return acc + sum;
  }, 0);

  return total;
};
