import React from "react"; // Don't forget to import React
import { Button } from "@heroui/button";

import { ModalComponent } from "../Modal/Modal";

import { useHandleOpenModal } from "@/hooks";
import PLusIcon from "@/components/icons/PlusIcon";

interface AddButtonProp {
  title: string;
  children: React.ReactNode;
}

export const AddButton = ({ title, children }: AddButtonProp) => {
  const { onOpen } = useHandleOpenModal();

  return (
    <>
      <Button
        isIconOnly
        aria-label="Agregar producto"
        className="fixed bottom-6 right-6 shadow-lg"
        color="success"
        radius="full"
        size="lg"
        variant="solid"
        onPress={onOpen}
      >
        <PLusIcon className="size-6" />
      </Button>
      <ModalComponent title={title}>{children}</ModalComponent>
    </>
  );
};
