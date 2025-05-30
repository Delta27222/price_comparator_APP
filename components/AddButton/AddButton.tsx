import React from "react"; // Don't forget to import React
import { Button } from "@heroui/button";

import { ModalComponent } from "../Modal/Modal";

import { useHandleOpenModal } from "@/hooks";
import PLusIcon from "@/components/icons/PlusIcon";

interface AddButtonProp {
  title: string;
  children: React.ReactNode;
  doubleModal?: React.ReactNode;
}

export const AddButton = ({ title, doubleModal, children }: AddButtonProp) => {
  const { onOpen } = useHandleOpenModal();
  const [renderComponent, setRenderComponent] =
    React.useState<React.ReactNode>(children);
  const [titleComponent, setTitleComponent] = React.useState<string>(title);

  const opendSecondModal = () => {
    onOpen();
    setRenderComponent(doubleModal);
    setTitleComponent("Add Product to Store");
  };

  const opendFirstModal = () => {
    onOpen();
    setRenderComponent(children);
    setTitleComponent(title);
  };

  return (
    <div className="fixed bottom-6 right-6 shadow-lg flex flex-col justify-center items-center gap-2">
      {doubleModal ? (
        <Button
          isIconOnly
          aria-label="Agregar producto"
          className="hover:scale-105"
          color="success"
          radius="full"
          size="md"
          variant="solid"
          onPress={opendSecondModal}
        >
          <PLusIcon className="size-5" />
        </Button>
      ) : null}
      <Button
        isIconOnly
        aria-label="Agregar producto"
        className="hover:scale-105"
        color="success"
        radius="full"
        size="lg"
        variant="solid"
        onPress={opendFirstModal}
      >
        <PLusIcon className="size-6" />
      </Button>
      <ModalComponent title={titleComponent}>{renderComponent}</ModalComponent>
    </div>
  );
};
