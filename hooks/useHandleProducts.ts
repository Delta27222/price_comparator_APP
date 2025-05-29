import React from "react";

import { HandleProductsContext } from "@/context";

export function useHandlerProducts() {
  const {
    products,
    setProducts,
    loading,
    error,
    filterProductsByText,
    searchedProducts,
    setSearchedProducts,
    createProduct,
    deleteProduct,
    updateProductActiveStatus,
    getProductById,
  } = React.useContext(HandleProductsContext);

  return {
    products,
    setProducts,
    loading,
    error,
    filterProductsByText,
    searchedProducts,
    setSearchedProducts,
    createProduct,
    deleteProduct,
    updateProductActiveStatus,
    getProductById,
  };
}
