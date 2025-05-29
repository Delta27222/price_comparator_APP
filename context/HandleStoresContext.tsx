/* eslint-disable no-console */
"use client";

import React from "react";
import toast from "react-hot-toast";

import { Product, Store } from "@/model";
import { useHandleOpenModal } from "@/hooks";

// Tipado del contexto
export type THandleStoresContext = {
  stores: Store[];
  setStores: React.Dispatch<React.SetStateAction<Store[]>>;
  searchedStores: Store[];
  setSearchedStores: React.Dispatch<React.SetStateAction<Store[]>>;
  loading: boolean;
  error: string | null;
  filterStoresByText: (query: string) => void;
  createStore: (data: any) => void;
  deleteStore: (id: string) => void;
  updateStoreActiveStatus: (id: string, newActiveStatus: boolean) => void;
};

// Crear el contexto con valores iniciales seguros
export const HandleStoresContext = React.createContext<THandleStoresContext>({
  stores: [],
  setStores: () => {},
  searchedStores: [],
  setSearchedStores: () => {},
  loading: false,
  error: null,
  filterStoresByText: () => {},
  createStore: () => {},
  deleteStore: () => {},
  updateStoreActiveStatus: () => {},
});

// Componente proveedor
type Props = {
  children: React.ReactNode;
};

export function HandleStoresProvider({ children }: Props) {
  const { onClose } = useHandleOpenModal();

  const [stores, setStores] = React.useState<Store[]>([]);
  const [searchedStores, setSearchedStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    refetchStores();
  }, []);

  const refetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/stores`);

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();

      setStores(data);
      setSearchedStores(data);
    } catch (err: any) {
      console.error("Error refetching Stores:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filterStoresByText = React.useCallback(
    async (query: string) => {
      setLoading(true);
      const normalizedQuery = query.toLowerCase().trim();

      const foundStores = stores.filter(
        (store) =>
          store.name.toLowerCase().includes(normalizedQuery) ||
          store.direction.toLowerCase().includes(normalizedQuery),
      );

      setSearchedStores(foundStores);

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
    [stores],
  );

  const createStore = async (data: any) => {
    try {
      const dataProduct = {
        ...data,
        isActive: true,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/stores`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataProduct),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Product successfully created!");

      setTimeout(() => {
        refetchStores();
      }, 1000);
      onClose();
    } catch (error) {
      console.error("❌ Error al crear el producto:", error);
      toast.error("Error creating product");
      throw error;
    }
  };

  const deleteStore = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      toast.success("Product successfully deleted!");

      setTimeout(() => {
        refetchStores();
      }, 1000);
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
      toast.error("Error deleting product");
      throw error;
    }
  };

  const updateStoreActiveStatus = async (
    id: string,
    newActiveStatus: boolean,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/stores/${id}`,
        {
          method: "PATCH", // Using PATCH for partial updates (only changing 'isActive')
          headers: {
            "Content-Type": "application/json",
          },
          // The body contains only the field you want to update
          body: JSON.stringify({ isActive: newActiveStatus }),
        },
      );

      if (!response.ok) {
        // Attempt to read the response body for more detailed errors from the server
        const errorData = await response.json().catch(() => null);

        throw new Error(
          `HTTP error! Status: ${response.status}. ${errorData ? JSON.stringify(errorData) : "No additional error data."}`,
        );
      }

      // Success toast message dynamically based on the new status
      toast.success(
        `Product successfully ${newActiveStatus ? "activated" : "deactivated"}!`,
      );

      setTimeout(() => {
        refetchStores(); // Assuming you have this function to refresh your product list
      }, 1000);
      // If you have a modal or drawer that needs to close after update, call onClose() here.
      // onClose();
    } catch (error) {
      console.error("❌ Error al actualizar el estado del producto:", error);
      toast.error("Error updating product status");
      throw error;
    }
  };

  const value = React.useMemo(
    () => ({
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
    }),
    [
      stores,
      loading,
      error,
      filterStoresByText,
      searchedStores,
      createStore,
      deleteStore,
      updateStoreActiveStatus,
    ],
  );

  return (
    <HandleStoresContext.Provider value={value}>
      {children}
    </HandleStoresContext.Provider>
  );
}
