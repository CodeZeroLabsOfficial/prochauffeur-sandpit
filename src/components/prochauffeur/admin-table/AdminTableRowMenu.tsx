"use client";

import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";
import React, { useState } from "react";

export type AdminTableRowMenuItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
};

type AdminTableRowMenuProps = {
  items: AdminTableRowMenuItem[];
};

export default function AdminTableRowMenu({ items }: AdminTableRowMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative flex justify-end">
      <button
        type="button"
        aria-label="Row actions"
        className="dropdown-toggle flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white/90"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <circle cx="4" cy="10" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="16" cy="10" r="1.5" />
        </svg>
      </button>
      <Dropdown isOpen={open} onClose={() => setOpen(false)} className="min-w-[10rem] py-1">
        {items.map((item) =>
          item.disabled ? (
            <span
              key={item.label}
              className="block px-4 py-2 text-sm text-gray-400 dark:text-gray-500"
            >
              {item.label}
            </span>
          ) : (
            <DropdownItem
              key={item.label}
              tag={item.href ? "a" : "button"}
              href={item.href}
              onClick={item.onClick}
              onItemClick={() => setOpen(false)}
              className={`dark:text-gray-300 dark:hover:bg-white/5 ${
                item.destructive
                  ? "text-error-600 hover:text-error-600 dark:text-error-500"
                  : ""
              }`}
            >
              {item.label}
            </DropdownItem>
          )
        )}
      </Dropdown>
    </div>
  );
}
