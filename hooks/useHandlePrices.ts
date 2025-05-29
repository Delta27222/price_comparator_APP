import React from "react";

import { HandlePricesContext } from "@/context";

export function useHandlerPrices() {
  const {
    prices,
    setPrices,
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
  } = React.useContext(HandlePricesContext);

  return {
    prices,
    setPrices,
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
  };
}
