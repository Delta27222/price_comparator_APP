/* eslint-disable @next/next/no-img-element */
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";

import { Price } from "@/model";
import { useHandlerPrices } from "@/hooks/useHandlePrices";

interface PriceCardProps {
  price: Price;
}

export const PriceCard = ({ price }: PriceCardProps) => {
  const { deletePrice } = useHandlerPrices();
  const { id, amount, store } = price;

  return (
    <Card className="group relative flex flex-col gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-visible">
      {/* Delete Button */}
      <Button
        isIconOnly
        aria-label="Delete price"
        className="absolute -top-5 -right-5 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110"
        color="danger"
        size="sm"
        variant="faded"
        onPress={() => deletePrice(id)}
      >
        ❌
      </Button>

      {/* Imagen del producto */}
      {store.image && (
        <div className="relative overflow-hidden rounded-lg">
          <img
            alt={store.name}
            className="w-full h-[160px] object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            src={store.image}
          />

          {/* 💰 Price badge con blur */}
          <div className="absolute top-2 right-2 backdrop-blur-sm bg-white/60 dark:bg-neutral-800/60 px-3 py-1 rounded-full shadow-md">
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              ${amount}
            </p>
          </div>
        </div>
      )}

      {/* Store info */}
      <div className="flex items-center gap-3 border-t border-gray-100 dark:border-neutral-700 pt-3">
        {store.image && (
          <img
            alt={store.name}
            className="w-10 h-10 rounded-full object-cover border"
            src={store.image}
          />
        )}
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {store.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {store.direction}
          </p>
        </div>
      </div>
    </Card>
  );
};
