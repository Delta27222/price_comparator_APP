"use client";
import React from "react";
import { Spinner } from "@heroui/spinner";

import { ProductDetailsSection } from "@/components/ProductDetails/ProductDetailsSection";
import { PricesList } from "@/components/PricesList/PricesList";
import { useHandlerPrices } from "@/hooks/useHandlePrices";
import { useHandlerStores } from "@/hooks/useHandleStores";
import { AddButton } from "@/components/AddButton/AddButton";
import { FormAddPrice } from "@/components/Forms/FormAddPrice";

export default function OneProductPage() {
  const { loading, error, product, createPrice, prices } = useHandlerPrices();
  const { stores } = useHandlerStores();

  const storeIdsNotInPrices = React.useMemo(() => {
    const priceStoreIds = new Set(prices.map((price) => price.storeId));

    return stores
      .filter((store) => !priceStoreIds.has(store.id))
      .map((store) => ({ id: store.id, name: store.name }));
  }, [stores, prices]);

  if (loading) {
    return <Spinner color="success" label="Loading..." size="lg" />;
  }

  if (error) {
    return <h1>HUBO UN ERROR..</h1>;
  }

  return (
    <div className="relative">
      <ProductDetailsSection product={product} />
      <div className="mt-32">
        <PricesList />
      </div>
      <AddButton title="Create Price">
        <FormAddPrice
          productId={product?.id ?? ""}
          storeIds={storeIdsNotInPrices}
          onSubit={createPrice}
        />
      </AddButton>
    </div>
  );
}
