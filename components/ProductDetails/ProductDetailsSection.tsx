import React from "react";

import { ProductDetailCard } from "./ProductDetails";

import { Product } from "@/model";

interface ProductDetailsSectionProps {
  product: Product | null;
}

export const ProductDetailsSection = ({
  product,
}: ProductDetailsSectionProps) => {
  return (
    <div className="inline-block absolute left-0 -top-52 ">
      <ProductDetailCard product={product} />
    </div>
  );
};
