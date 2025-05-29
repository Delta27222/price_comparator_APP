import React from "react";

import { HandleOpenModalContext } from "@/context";

export function useHandleOpenModal() {
  const { isOpen, onOpen, onClose } = React.useContext(HandleOpenModalContext);

  return {
    isOpen,
    onOpen,
    onClose,
  };
}
