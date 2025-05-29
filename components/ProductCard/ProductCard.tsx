/* eslint-disable @next/next/no-img-element */
import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";

import { Product } from "@/model";
import { useHandlerProducts } from "@/hooks";

interface ProductCardProps {
  product: Product;
}
export const ProductCard = ({ product }: ProductCardProps) => {
  const { deleteProduct } = useHandlerProducts();
  const { name, description, image, id } = product;

  return (
    <Card className="group relative p-4 bg-white dark:bg-neutral-900 rounded-xl shadow-md dark:shadow-none hover:shadow-xl dark:hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-visible">
      {/* Delete Button */}
      <Button
        isIconOnly
        aria-label="Delete product"
        className="absolute -top-5 -right-5 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 "
        color="warning"
        size="sm"
        variant="faded"
        onPress={() => deleteProduct(id)}
      >
        <p className="mt-1 text-sm">❌</p>
      </Button>
      <div className="overflow-hidden rounded-lg">
        <img
          alt={name}
          className="w-full h-[180px] object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
          src={image}
        />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold">
          {name}
        </p>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight truncate">
          {description}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">12 Tracks</p>
      </div>

      <div className="mt-4 ">
        <Link href={`/products/${id}`}>
          <Button className="text-white w-full" color="success">
            View details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
