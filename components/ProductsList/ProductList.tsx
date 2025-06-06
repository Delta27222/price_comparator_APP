import React from "react";

import { ProductCard } from "../ProductCard/ProductCard";

import { Product } from "@/model";
import { useHandlerProducts } from "@/hooks";

export const ProductsList = () => {
  const { products, searchedProducts } = useHandlerProducts();
  const listToShow = React.useMemo(() => {
    if (searchedProducts.length > 0) {
      return searchedProducts;
    }

    return products;
  }, [searchedProducts]);
  console.log("🚀 ~ ProductsList ~ products:", products)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {listToShow.map((product: Product, index: number) => (
        <ProductCard key={index} product={product} />
      ))}
    </div>
  );
};
