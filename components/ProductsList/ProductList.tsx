import React from "react";

import { ProductCard } from "../ProductCard/ProductCard";

import { Product } from "@/model";
import { useHandlerProducts } from "@/hooks";

export const ProductsList = () => {
  const { products, searchedProducts } = useHandlerProducts();
  const listToShow = React.useMemo(() => {
    const source = searchedProducts.length > 0 ? searchedProducts : products;
    const uniqueMap = new Map<string, Product>();

    source.forEach((product) => {
      const key = product.name.trim().toLowerCase();

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, product);
      }
    });

    const grouped: Record<string, Product[]> = {};

    Array.from(uniqueMap.values()).forEach((product) => {
      const firstLetter = product.name.trim().charAt(0).toUpperCase();

      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(product);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, products]) => ({
        letter,
        products: products.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        ),
      }));
  }, [searchedProducts, products]);

  return (
    <div className="w-full space-y-8">
      {listToShow.map(({ letter, products }) => (
        <div
          key={letter}
          className="flex flex-col justify-center items-start mb-4"
        >
          <div className="flex flex-row justify-center items-center w-full space-x-4 mb-4">
            <h2 className="text-xl font-bold">{letter}</h2>
            <div className="h-[1px] bg-gray-400 w-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
