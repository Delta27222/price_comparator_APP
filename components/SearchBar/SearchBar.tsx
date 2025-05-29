"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Input } from "@heroui/input";
import { Kbd } from "@heroui/kbd";

import { SearchIcon } from "../icons";

import { useHandlerProducts } from "@/hooks";
import { useHandlerStores } from "@/hooks/useHandleStores";
import { useHandlerPrices } from "@/hooks/useHandlePrices";

export const SearchBar = () => {
  const pathname = usePathname();
  const { filterProductsByText } = useHandlerProducts();
  const { filterStoresByText } = useHandlerStores();
  const { filterPricesByText } = useHandlerPrices();

  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (pathname === "/products") {
      filterProductsByText(query);
    }
    if (pathname === "/stores") {
      filterStoresByText(query);
    }
    if (pathname === "/products" || pathname.startsWith("/products/")) {
      filterPricesByText(query);
    }
  }, [query, pathname, filterProductsByText]);

  return (
    <>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Buscar productos..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  );
};
