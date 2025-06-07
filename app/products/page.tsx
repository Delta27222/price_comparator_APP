"use client";
import React from "react";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";

import { useHandlerProducts } from "@/hooks";
import { ProductsList } from "@/components/ProductsList/ProductList";
import { FormAddProduct } from "@/components/Forms/FormAddProduct";
import { AddButton } from "@/components/AddButton/AddButton";
import { FormAddProductToStore } from "@/components/Forms/FormAddProductToStore";
import { useHandlerPrices } from "@/hooks/useHandlePrices";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { ProductsTable } from "@/components/ProductTable/ProductTable";

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
          <Tabs
            aria-label="Options"
            className="flex flex-row justify-start items-center mb-5"
          >
            <Tab key="products-list" title="Products List">
              <ProductsList />
            </Tab>
            <Tab key="products-table" title="Products Table">
              <ProductsTable />
            </Tab>
          </Tabs>
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
