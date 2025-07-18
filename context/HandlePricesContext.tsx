"use client";

// types/context/price.ts
import React from "react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";

import { Price, Product } from "@/model";
import { useHandleOpenModal } from "@/hooks";

export type THandlePricesContext = {
  prices: Price[];
  setPrices: React.Dispatch<React.SetStateAction<Price[]>>;
  allPrices: Price[];
  setAllPrices: React.Dispatch<React.SetStateAction<Price[]>>;
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  searchedPrices: Price[];
  setSearchedPrices: React.Dispatch<React.SetStateAction<Price[]>>;
  loading: boolean;
  loadingCreating: boolean;
  error: string | null;
  filterPricesByText: (query: string) => void;
  createPrice: (data: any) => void;
  deletePrice: (id: string) => void;
  updatePrice: (id: string, data: any) => void;
  getAllPrices: () => Promise<void>;
};

export const HandlePricesContext = React.createContext<THandlePricesContext>({
  prices: [],
  setPrices: () => {},
  allPrices: [],
  setAllPrices: () => {},
  product: null,
  setProduct: () => {},
  searchedPrices: [],
  setSearchedPrices: () => {},
  loading: false,
  loadingCreating: false,
  error: null,
  filterPricesByText: () => {},
  createPrice: () => {},
  deletePrice: () => {},
  updatePrice: () => {},
  getAllPrices: async () => {},
});

type Props = {
  children: React.ReactNode;
};

export function HandlePricesProvider({ children }: Props) {
  const params = useParams();
  const productId = params.id as string;

  const { onClose } = useHandleOpenModal();
  const [prices, setPrices] = React.useState<Price[]>([]);
  const [allPrices, setAllPrices] = React.useState<Price[]>([]);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [searchedPrices, setSearchedPrices] = React.useState<Price[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingCreating, setLoadingCreating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (productId) fetchPricesFromProduct();
  }, [productId]);

  const fetchPricesFromProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/prices/product/${productId}`,
      );

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();

      setPrices(data.prices);
      setSearchedPrices(data.prices);
      setProduct(data?.product ?? null);
    } catch (err: any) {
      console.error("❌ Error fetching Prices:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getAllPrices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/prices`);

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();

      setAllPrices(data);
      setSearchedPrices(data.prices);
    } catch (err: any) {
      console.error("❌ Error fetching all Prices:", err); // Adjusted log message
      setError(err.message || "Unknown error fetching all prices");
    } finally {
      setLoading(false);
    }
  };

  const filterPricesByText = (query: string) => {
    const normalized = query.toLowerCase().trim();
    const result = prices.filter(
      (price) =>
        price.product?.name.toLowerCase().includes(normalized) ||
        price.store?.name.toLowerCase().includes(normalized),
    );

    setSearchedPrices(result);
  };

  const createPrice = async (data: any) => {
    try {
      setLoadingCreating(true);
      const dataToSend = {
        ...data,
        amount: parseFloat(data.amount),
        periodId: "cebf04c6-e60a-40dd-9f5d-2878bd82e518",
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/prices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        },
      );

      if (!response.ok) throw new Error("Failed to create price");

      toast.success("Price successfully created!");
      await fetchPricesFromProduct();
      onClose();
    } catch (error) {
      console.error("❌ Error creating price:", error);
      toast.error("Error creating price");
    } finally {
      setLoadingCreating(false);
    }
  };

  const deletePrice = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/prices/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        },
      );

      if (!res.ok) throw new Error("Failed to delete price");

      toast.success("Price successfully deleted!");
      await fetchPricesFromProduct();
    } catch (error) {
      console.error("❌ Error deleting price:", error);
      toast.error("Error deleting price");
    }
  };

  const updatePrice = async (id: string, data: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/prices/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!res.ok) throw new Error("Failed to update price");

      toast.success("Price successfully updated!");
      await fetchPricesFromProduct();
    } catch (error) {
      console.error("❌ Error updating price:", error);
      toast.error("Error updating price");
    }
  };

  const value = React.useMemo(
    () => ({
      prices,
      setPrices,
      allPrices,
      setAllPrices,
      product,
      setProduct,
      searchedPrices,
      setSearchedPrices,
      loading,
      loadingCreating,
      error,
      filterPricesByText,
      createPrice,
      deletePrice,
      updatePrice,
      getAllPrices,
    }),
    [prices, searchedPrices, loading, error, product],
  );

  return (
    <HandlePricesContext.Provider value={value}>
      {children}
    </HandlePricesContext.Provider>
  );
}
