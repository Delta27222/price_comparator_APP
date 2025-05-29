/* eslint-disable @next/next/no-img-element */
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";

import { Store } from "@/model"; // Assuming you have a Store model defined here
import { useHandlerStores } from "@/hooks/useHandleStores";

interface StoreCardProps {
  store: Store;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  // Assuming useHandlerStores provides deleteStore similar to deleteProduct
  const { deleteStore } = useHandlerStores();
  const { name, direction, image, id } = store; // Assuming 'id' is part of your Store model

  return (
    <Card className="group relative p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-visible">
      {/* Delete Button */}
      <Button
        isIconOnly
        aria-label="Delete store" // Updated aria-label for stores
        className="absolute -top-5 -right-5 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 "
        color="warning"
        size="sm"
        variant="faded"
        onPress={() => deleteStore(id)} // Call deleteStore with store's ID
      >
        <p className="mt-1 text-sm">❌</p>
      </Button>
      <div className="overflow-hidden rounded-lg">
        <img
          alt={name}
          className="min-w-[100px] w-full h-[180px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          src={image}
        />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
          {name}
        </p>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
          {direction} {/* Displaying direction here */}
        </h3>
        {/* Removed "12 Tracks" as it's product-specific */}
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">12 Tracks</p> */}
      </div>

      <div className="mt-4 ">
        <Link href={`/stores/${id}`}>
          {" "}
          {/* Updated link path for stores */}
          <Button className="text-white w-full" color="success">
            View details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
