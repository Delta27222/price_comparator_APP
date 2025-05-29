import React from "react";

import { HandleStoresContext } from "@/context";

export function useHandlerStores() {
  const {
    stores,
    setStores,
    loading,
    error,
    filterStoresByText,
    searchedStores,
    setSearchedStores,

    createStore,
    deleteStore,
    updateStoreActiveStatus,
  } = React.useContext(HandleStoresContext);

  return {
    stores,
    setStores,
    loading,
    error,
    filterStoresByText,
    searchedStores,
    setSearchedStores,

    createStore,
    deleteStore,
    updateStoreActiveStatus,
  };
}
