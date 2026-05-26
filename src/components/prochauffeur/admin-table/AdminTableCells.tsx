import React from "react";

export function PrimaryCell({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-medium text-gray-800 dark:text-white/90">
      {children}
    </span>
  );
}

export function SecondaryCell({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-gray-500 dark:text-gray-400">{children}</span>
  );
}
