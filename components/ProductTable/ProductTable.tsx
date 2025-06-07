import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";

import { useHandlerProducts } from "@/hooks";
import { Product } from "@/model";

export const ProductsTable = () => {
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
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        ),
      }));
  }, [searchedProducts, products]);

  return (
    <Table aria-label="Tabla de Productos">
      <TableHeader>
        <TableColumn>PRODUCTO</TableColumn>
        <TableColumn>DESCRIPCIÓN</TableColumn>
        <TableColumn>PRECIO MÁS BAJO</TableColumn>
        <TableColumn>TIENDA</TableColumn>
      </TableHeader>
      <TableBody>
        {listToShow.flatMap((category) =>
          category.products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>
                <div className="w-20 backdrop-blur-sm bg-white/60 dark:bg-neutral-800/60 px-2 py-1 rounded-full shadow-md flex flex-col justify-center items-center">
                  {Number(product.shortestPrice) === 0 ? (
                    <span className="text-sm text-gray-400">N/A</span>
                  ) : (
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                      {Number(product.shortestPrice) > 1
                        ? `$${Number(product.shortestPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `$${Number(product.shortestPrice).toFixed(2)}`}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{product.shortestPriceStoreName || "N/A"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
