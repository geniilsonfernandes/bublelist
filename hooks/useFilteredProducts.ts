import { useMemo } from "react";

export function useFilteredProducts(product: string, productData: string[]) {
  return useMemo(() => {
    const filtered = productData.filter((item) =>
      item.toLowerCase().includes(product.toLowerCase())
    );

    return filtered.length > 0 ? filtered : productData.slice(0, 5);
  }, [product, productData]);
}
