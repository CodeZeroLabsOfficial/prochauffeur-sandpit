"use client";

import {
  ModalFormBody,
  ModalFormFooter,
  ModalFormHeader,
  modalPanelClassName,
  type ModalShellSize,
} from "@/components/prochauffeur/modalShell";
import { Modal } from "@/components/ui/modal";
import React from "react";

type FormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerAlign?: "end" | "between";
  size?: ModalShellSize;
  bodyClassName?: string;
  className?: string;
};

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  footerAlign = "end",
  size = "md",
  bodyClassName = "",
  className,
}: FormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      containScroll
      showCloseButton={false}
      className={className ?? modalPanelClassName(size)}
    >
      <ModalFormHeader title={title} onClose={onClose} />
      <ModalFormBody className={bodyClassName}>{children}</ModalFormBody>
      {footer ? (
        <ModalFormFooter align={footerAlign}>{footer}</ModalFormFooter>
      ) : null}
    </Modal>
  );
}
