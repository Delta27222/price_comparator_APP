"use client";
import React from "react";
import { Spinner } from "@heroui/spinner";

import { useHandlerProducts } from "@/hooks";
import { ProductsList } from "@/components/ProductsList/ProductList";
import { FormAddProduct } from "@/components/Forms/FormAddProduct";
import { AddButton } from "@/components/AddButton/AddButton";

export default function ProductsPage() {
  const { loading, error, createProduct } = useHandlerProducts();

  if (error) {
    return <h1>HUBO UN ERROR..</h1>;
  }

  return (
    <>
      {!loading ? (
        <>
          <ProductsList />
          <AddButton title="Create New Product">
            <FormAddProduct onSubit={createProduct} />
          </AddButton>
        </>
      ) : (
        <Spinner color="success" label="Loading..." size="lg" />
      )}
    </>
  );
}
