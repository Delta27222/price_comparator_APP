import React from "react";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import Link from "next/link";

interface ProductData {
  name: string;
  description: string;
  image: string | null;
  storeId: string;
  amount: number;
  productId: string;
  [key: string]: FormDataEntryValue | string | number | null;
}

interface StoreOption {
  id: string;
  name: string;
}

interface FormAddPriceProps {
  productId: string;
  storeIds: StoreOption[];
  onSubit(data: Partial<ProductData>): void;
}

export const FormAddPrice = ({
  productId,
  storeIds,
  onSubit,
}: FormAddPriceProps) => {
  const [selectedStore, setSelectedStore] = React.useState<string>("");
  const [amount, setAmount] = React.useState<number | "">("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Partial<ProductData> = {
      productId,
      storeId: selectedStore,
      amount: typeof amount === "string" ? parseFloat(amount) : amount,
    };

    formData.forEach((value, key) => {
      data[key as keyof ProductData] = value;
    });

    onSubit(data);
  };

  return (
    <Form onSubmit={onSubmit}>
      {storeIds.length > 0 ? (
        <>
          {/* Price Input */}
          <Input
            isRequired
            className="mb-4"
            label="Price (amount)"
            labelPlacement="outside"
            name="amount"
            placeholder="e.g., 29.99"
            type="number"
            value={amount.toString()}
            onChange={(e) =>
              setAmount(e.target.value ? parseFloat(e.target.value) : "")
            }
          />
          {/* Select Store */}
          <Select
            isRequired
            className="mb-4"
            items={storeIds}
            label="Select Store"
            placeholder="Choose a store"
            selectedKeys={[selectedStore]}
            onSelectionChange={(keys) =>
              setSelectedStore(Array.from(keys)[0] as string)
            }
          >
            {(store) => <SelectItem key={store.id}>{store.name}</SelectItem>}
          </Select>

          <Button className="w-full" color="success" type="submit">
            Add Price
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You have no more stores available to assign prices to this product
          </p>
          <Link href={"/stores"}>
            <Button color="primary" variant="shadow">
              Create a new store
            </Button>
          </Link>
        </div>
      )}
    </Form>
  );
};
