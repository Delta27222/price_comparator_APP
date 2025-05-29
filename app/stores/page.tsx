"use client";
import React from "react";
import { Spinner } from "@heroui/spinner";

import { AddButton } from "@/components/AddButton/AddButton";
import { FormAddStore } from "@/components/Forms/FormAddStore";
import { useHandlerStores } from "@/hooks/useHandleStores";
import { StoresList } from "@/components/StoresList/StoresList";

export default function StoresPage() {
  const { loading, error, createStore } = useHandlerStores();

  if (loading) {
    return <Spinner color="success" label="Loading..." size="lg" />;
  }

  if (error) {
    return <h1>HUBO UN ERROR..</h1>;
  }

  return (
    <>
      <StoresList />
      <AddButton title="Create New Store">
        <FormAddStore onSubmit={createStore} />
      </AddButton>
    </>
  );
}
