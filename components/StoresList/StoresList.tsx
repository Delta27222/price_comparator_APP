import React from "react";

import { StoreCard } from "../StoreCard/StoreCard";

import { Store } from "@/model";
import { useHandlerStores } from "@/hooks/useHandleStores";

export const StoresList = () => {
  const { stores, searchedStores } = useHandlerStores();

  const listToShow = React.useMemo(() => {
    if (searchedStores.length > 0) {
      return searchedStores;
    }

    return stores;
  }, [searchedStores, stores]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {listToShow.map((store: Store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};
