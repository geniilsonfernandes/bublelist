import { Product } from "@/state/use-products-store";
import { useMemo } from "react";

export function filterProductsByName(product: string, productData: string[]) {
  return productData.filter((item) =>
    item.toLowerCase().includes(product.toLowerCase())
  );
}

export function filterProductsInList(product: string, productData?: Product[]) {
  return productData?.find((item) =>
    item.name.toLowerCase().startsWith(product.toLowerCase())
  );
}

export function useFilteredProducts(product: string, productData: string[]) {
  return useMemo(() => {
    const filtered = filterProductsByName(product, productData);

    return filtered.length > 0 ? filtered : productData.slice(0, 5);
  }, [product, productData]);
}
