import React from "react";

import { PriceCard } from "../PriceCard/PriceCard";

import { Price } from "@/model";
import { useHandlerPrices } from "@/hooks/useHandlePrices";

export const PricesList = () => {
  const { prices, searchedPrices } = useHandlerPrices();

  const listToShow = React.useMemo(() => {
    return searchedPrices.length > 0 ? searchedPrices : prices;
  }, [searchedPrices, prices]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {listToShow.length > 0 ? ( // Check if the list has items
        listToShow.map((price: Price) => (
          <PriceCard key={price.id} price={price} />
        ))
      ) : (
        // Display a message when the list is empty
        <div className="col-span-full text-center py-10 mt-10">
          <p className="text-xl text-gray-500">No prices found.</p>
        </div>
      )}
    </div>
  );
};
