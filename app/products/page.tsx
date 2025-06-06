"use client";
import React from "react";
import { Spinner } from "@heroui/spinner";

import { useHandlerProducts } from "@/hooks";
import { ProductsList } from "@/components/ProductsList/ProductList";
import { FormAddProduct } from "@/components/Forms/FormAddProduct";
import { AddButton } from "@/components/AddButton/AddButton";
import { FormAddProductToStore } from "@/components/Forms/FormAddProductToStore";
import { useHandlerPrices } from "@/hooks/useHandlePrices";
import { SearchBar } from "@/components/SearchBar/SearchBar";

export default function ProductsPage() {
  const { loading, loadingCreation, error, createProduct } =
    useHandlerProducts();
  const { createPrice, loadingCreating } = useHandlerPrices();

  if (error) {
    return <h1>HUBO UN ERROR..</h1>;
  }

  return (
    <>
      {!loading ? (
        <>
          <div className="md:hidden mb-5">
            <SearchBar />
          </div>
          <ProductsList />
          <AddButton
            doubleModal={
              <FormAddProductToStore
                loading={loadingCreating}
                onSubmit={createPrice}
              />
            }
            title="Create New Product"
          >
            <FormAddProduct loading={loadingCreation} onSubit={createProduct} />
          </AddButton>
        </>
      ) : (
        <Spinner color="success" label="Loading..." size="lg" />
      )}
    </>
  );
}
