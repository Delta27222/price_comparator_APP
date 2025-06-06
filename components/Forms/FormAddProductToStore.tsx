import React from "react";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

import { useHandlerProducts } from "@/hooks";
import { useHandlerStores } from "@/hooks/useHandleStores";
import { useHandlerPrices } from "@/hooks/useHandlePrices";

interface DataToSend {
  productId: string;
  storeId: string;
  periodId: string;
  amount: string;
}

interface FormAddProductToStoreProps {
  onSubmit: (data: DataToSend) => void;
  loading: boolean;
}

export const FormAddProductToStore = ({
  loading,
  onSubmit,
}: FormAddProductToStoreProps) => {
  const { products } = useHandlerProducts();
  const { stores } = useHandlerStores();

  const { allPrices, getAllPrices } = useHandlerPrices();

  React.useEffect(() => {
    const loadData = async () => {
      await getAllPrices();
    };

    loadData();
  }, []);

  const [dataToSend, setDataToSend] = React.useState<DataToSend>({
    productId: "",
    storeId: "",
    periodId: "",
    amount: "",
  });

  const onSubmitHanldler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (dataToSend.productId && dataToSend.storeId && dataToSend.amount) {
      onSubmit(dataToSend);
    } else {
      console.warn(
        "Please select all required fields (Product, Store) and enter an Amount.",
      );
    }
  };

  const MemoizedStores = React.useMemo(() => {
    const { productId } = dataToSend; // Get the currently selected product ID

    // If no product is selected yet, show all stores
    if (!productId) {
      return stores.map((store) => ({
        id: store.id,
        name: store.name,
      }));
    }

    // Filter prices to find combinations of the selected product and stores
    const assignedStoreIdsForSelectedProduct = new Set(
      allPrices
        .filter((price) => price.productId === productId)
        .map((price) => price.storeId),
    );

    // Filter the 'stores' list: keep only stores whose ID is NOT in the set
    const storesNotAssignedToSelectedProduct = stores.filter(
      (store) => !assignedStoreIdsForSelectedProduct.has(store.id),
    );

    return storesNotAssignedToSelectedProduct.map((store) => ({
      id: store.id,
      name: store.name,
    }));
  }, [stores, allPrices, dataToSend.productId]);

  const MemoizedProducts = React.useMemo(() => {
    return products
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((product) => ({ id: product.id, name: product.name }));
  }, [products]);

  return (
    <Form className="" onSubmit={onSubmitHanldler}>
      {/* Input for Amount */}
      <Input
        isRequired
        className="mb-4"
        label="Price (amount)"
        labelPlacement="outside"
        name="amount"
        placeholder="e.g., 29.99"
        type="number"
        value={dataToSend.amount}
        onChange={(e) =>
          setDataToSend((prev) => ({
            ...prev,
            amount: e.target.value,
          }))
        }
      />

      {/* Product Selection */}
      <Select
        isRequired
        className="mb-4"
        items={MemoizedProducts}
        label="Select Product"
        placeholder="Choose a product"
        selectedKeys={dataToSend.productId ? [dataToSend.productId] : []}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;

          setDataToSend((prev) => ({
            ...prev,
            productId: selectedKey,
            storeId: "", // Clear selected store when product changes
          }));
        }}
      >
        {(product) => <SelectItem key={product.id}>{product.name}</SelectItem>}
      </Select>

      {/* Store Selection */}
      <Select
        isRequired
        className="mb-4"
        isDisabled={!dataToSend.productId}
        items={MemoizedStores}
        label="Select Store"
        placeholder={
          dataToSend.productId ? "Choose a store" : "Select a product first"
        }
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;

          setDataToSend((prev) => ({
            ...prev,
            storeId: selectedKey,
          }));
        }}
        // Disable store selection if no product is chosen
        selectedKeys={dataToSend.storeId ? [dataToSend.storeId] : []}
      >
        {(store) => <SelectItem key={store.id}>{store.name}</SelectItem>}
      </Select>

      <Button
        className="w-full"
        color="success"
        disabled={loading}
        type="submit"
      >
        {loading ? "Adding..." : "Add Product to Store"}
      </Button>
    </Form>
  );
};
