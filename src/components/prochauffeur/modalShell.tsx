import { ModalCloseButton } from "@/components/ui/modal";
import React from "react";

export const MODAL_PANEL_BASE =
  "flex max-h-[min(720px,calc(100vh-2rem))] w-full flex-col overflow-hidden p-0";

export const MODAL_SIZE_CLASS = {
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
} as const;

export type ModalShellSize = keyof typeof MODAL_SIZE_CLASS;

export function modalPanelClassName(size: ModalShellSize = "md"): string {
  return `${MODAL_PANEL_BASE} ${MODAL_SIZE_CLASS[size]}`;
}

export function ModalFormHeader({
  title,
  onClose,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6">
      <h4 className="text-lg font-medium text-gray-800 dark:text-white/90">
        {title}
      </h4>
      <ModalCloseButton onClose={onClose} />
    </div>
  );
}

export function ModalFormBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function ModalFormFooter({
  children,
  align = "end",
}: {
  children: React.ReactNode;
  align?: "end" | "between";
}) {
  const alignClass =
    align === "between" ? "justify-between" : "justify-end";

  return (
    <div
      className={`flex shrink-0 flex-wrap items-center gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-6 ${alignClass}`}
    >
      {children}
    </div>
  );
}

export function ModalFormDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">{children}</p>
  );
}

/** Right-aligned primary actions (Cancel + Save). */
export function ModalFormFooterActions({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

/** Delete on the left; Cancel + Save on the right. */
export function ModalFormFooterSplit({
  left,
  right,
}: {
  left?: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-3">{left}</div>
      <ModalFormFooterActions>{right}</ModalFormFooterActions>
    </>
  );
}
