/* eslint-disable no-console */
"use client";

import React from "react";
import toast from "react-hot-toast";

import { Product } from "@/model";
import { useHandleOpenModal } from "@/hooks";

// Tipado del contexto
export type THandleProductsContext = {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  searchedProducts: Product[];
  setSearchedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  loading: boolean;
  error: string | null;
  filterProductsByText: (query: string) => void;
  createProduct: (data: any) => void;
  deleteProduct: (id: string) => void;
  updateProductActiveStatus: (id: string, newActiveStatus: boolean) => void;
  getProductById: (id: string) => Promise<Product | null>;
};

// Crear el contexto con valores iniciales seguros
export const HandleProductsContext =
  React.createContext<THandleProductsContext>({
    products: [],
    setProducts: () => {},
    searchedProducts: [],
    setSearchedProducts: () => {},
    loading: false,
    error: null,
    filterProductsByText: () => {},
    createProduct: () => {},
    deleteProduct: () => {},
    updateProductActiveStatus: () => {},
    getProductById: async () => null,
  });

// Componente proveedor
type Props = {
  children: React.ReactNode;
};

export function HandleProductsProvider({ children }: Props) {
  const { onClose } = useHandleOpenModal();

  const [products, setProducts] = React.useState<Product[]>([]);
  const [searchedProducts, setSearchedProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    refetchProducts();
  }, []);

  const refetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`);

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();

      setProducts(data);
    } catch (err: any) {
      console.error("Error refetching products:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByText = React.useCallback(
    async (query: string) => {
      const normalizedQuery = query.toLowerCase().trim();
      const foundProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(normalizedQuery) ||
          product.description.toLowerCase().includes(normalizedQuery),
      );

      setTimeout(() => {
        setSearchedProducts(foundProducts);
      }, 1000);
    },
    [products],
  );

  const createProduct = async (data: any) => {
    try {
      const dataProduct = {
        ...data,
        price: 1,
        isActive: true,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
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
        refetchProducts();
      }, 1000);
      onClose();
    } catch (error) {
      console.error("❌ Error al crear el producto:", error);
      toast.error("Error creating product");
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
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
        refetchProducts();
      }, 1000);
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
      toast.error("Error deleting product");
      throw error;
    }
  };

  const updateProductActiveStatus = async (
    id: string,
    newActiveStatus: boolean,
  ) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
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
        refetchProducts(); // Assuming you have this function to refresh your product list
      }, 1000);
      // If you have a modal or drawer that needs to close after update, call onClose() here.
      // onClose();
    } catch (error) {
      console.error("❌ Error al actualizar el estado del producto:", error);
      toast.error("Error updating product status");
      throw error;
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    setLoading(true); // Indicate loading when fetching a single product
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        },
      );

      // If the product is not found, return null
      if (response.status === 404) {
        console.warn(`Product with ID ${id} not found (404).`);

        return null;
      }

      // If the response is not OK for reasons other than 404, throw an error
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = `HTTP error! Status: ${response.status}. ${errorData ? JSON.stringify(errorData) : "No additional error data."}`;

        console.error(
          `❌ Server error fetching product ID ${id}:`,
          errorMessage,
        );
        throw new Error(errorMessage);
      }

      // Parse the response data
      const data: Product = await response.json();

      return data; // Return the fetched product
    } catch (error: any) {
      // Catch any network errors or errors thrown above
      console.error(
        `❌ Network or unexpected error fetching product with ID ${id}:`,
        error,
      );
      setError(error.message || "Failed to fetch product details."); // Set error state in the hook
      throw error; // Re-throw the error so the consuming component can also catch it
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  const value = React.useMemo(
    () => ({
      products,
      setProducts,
      loading,
      error,
      filterProductsByText,
      searchedProducts,
      setSearchedProducts,

      createProduct,
      deleteProduct,
      updateProductActiveStatus,
      getProductById,
    }),
    [
      products,
      loading,
      error,
      filterProductsByText,
      searchedProducts,
      createProduct,
      deleteProduct,
      updateProductActiveStatus,
      getProductById,
    ],
  );

  return (
    <HandleProductsContext.Provider value={value}>
      {children}
    </HandleProductsContext.Provider>
  );
}
