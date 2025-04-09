// utils/sortAndFilterProducts.ts

import { Product } from "@/state/use-products-store";





export interface SortAndFilterParams {
  products: Product[];
  orderBy: "name" | "quantity" | "value";
  search: string;
  filter: "Todos" | "Marcados" | "Desmarcados";
}

export function sortAndFilterProducts({
  products,
  orderBy,
  search,
  filter,
}: SortAndFilterParams): Product[] {
  const sorted = [...(products || [])];

  // Ordenar produtos de acordo com o campo selecionado
  sorted.sort((a, b) => {
    if (orderBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (orderBy === "quantity") {
      return b.quantity - a.quantity;
    } else if (orderBy === "value") {
      return b.value - a.value;
    }
    return 0;
  });

  return sorted.filter((product) => {
    if (search) {
      return product.name.toLowerCase().includes(search.toLowerCase());
    }
    if (filter === "Todos") return true;
    if (filter === "Marcados") return product.checked;
    if (filter === "Desmarcados") return !product.checked;
    return true;
  });
}
