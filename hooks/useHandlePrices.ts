import React from "react";

import { HandlePricesContext } from "@/context";

export function useHandlerPrices() {
  const {
    prices,
    setPrices,
    allPrices,
    setAllPrices,
    product,
    setProduct,
    searchedPrices,
    setSearchedPrices,
    loading,
    error,
    filterPricesByText,
    createPrice,
    deletePrice,
    updatePrice,
    getAllPrices,
  } = React.useContext(HandlePricesContext);

  return {
    prices,
    setPrices,
    allPrices,
    setAllPrices,
    product,
    setProduct,
    searchedPrices,
    setSearchedPrices,
    loading,
    error,
    filterPricesByText,
    createPrice,
    deletePrice,
    updatePrice,
    getAllPrices,
  };
}
