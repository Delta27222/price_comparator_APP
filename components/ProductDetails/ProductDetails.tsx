/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";

import { Product } from "@/model";

interface ProductDetailCardProps {
  product: Product | null;
  onClose?: () => void;
}

export const ProductDetailCard = ({
  product,
  onClose,
}: ProductDetailCardProps) => {
  // Check if product is an empty object or not a valid Product
  const isProductValid =
    product && Object.keys(product).length > 0 && "name" in product;

  // Conditionally destructure properties only if product is valid
  const { name, description, image } = isProductValid
    ? (product as Product)
    : { name: "", description: "", image: "" };

  return (
    <Card className="rounded-lg p-0 w-full">
      <CardHeader className="flex flex-col sm:flex-row gap-4 items-center justify-between ">
        {isProductValid ? (
          <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {name}
          </h1>
        ) : (
          <h1 className="text-lg font-bold text-gray-500 dark:text-gray-400 leading-tight">
            Product Details Not Available
          </h1>
        )}
      </CardHeader>

      <Divider />

      {isProductValid ? (
        <>
          <CardBody className="flex flex-row  gap-6 p-6">
            {/* Product Image */}
            <img
              alt={name}
              className="w-[80px] object-contain rounded-lg shadow-md dark:shadow-none"
              src={image}
            />

            {/* Product Details */}
            <div className="flex flex-col">
              <p className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Description:
              </p>
              <p className="text-sm md:text-md text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </div>
          </CardBody>
        </>
      ) : (
        <CardBody className="p-6 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We could not find the details for this product. It might not exist
            or there was an error loading it.
          </p>
        </CardBody>
      )}

      <Divider />
    </Card>
  );
};
