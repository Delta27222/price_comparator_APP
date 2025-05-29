import React from "react"; // Don't forget to import React
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";

import { useHandleOpenModal } from "@/hooks";

interface ModalProps {
  title: string;
  children: React.ReactNode;
}

export const ModalComponent = ({ title, children }: ModalProps) => {
  const { isOpen, onClose } = useHandleOpenModal();

  return (
    <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody className="mb-3">{children}</ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
