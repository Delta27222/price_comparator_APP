/* eslint-disable no-console */
"use client";

import React from "react";
import { useDisclosure } from "@heroui/modal";

export type THandleOpenModalContext = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const HandleOpenModalContext =
  React.createContext<THandleOpenModalContext>({
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  });

type Props = {
  children: React.ReactNode;
};

export function HandleOepnModalProvider({ children }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();


  const value = React.useMemo(
    () => ({
      isOpen,
      onOpen,
      onClose,
    }),
    [isOpen, onOpen, onClose],
  );

  return (
    <HandleOpenModalContext.Provider value={value}>
      {children}
    </HandleOpenModalContext.Provider>
  );
}
