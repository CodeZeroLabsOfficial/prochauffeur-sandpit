"use client";

import Label from "@/components/form/Label";
import React from "react";

type NumberStepperProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export default function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max,
  disabled = false,
}: NumberStepperProps) {
  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max == null || value < max);

  function decrement() {
    if (!canDecrement) return;
    onChange(value - 1);
  }

  function increment() {
    if (!canIncrement) return;
    onChange(value + 1);
  }

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex h-11 items-stretch overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
        <StepperButton
          label="Decrease"
          onClick={decrement}
          disabled={!canDecrement}
        >
          −
        </StepperButton>
        <div className="flex min-w-0 flex-1 items-center justify-center border-x border-gray-300 bg-transparent text-sm font-medium text-gray-800 dark:border-gray-700 dark:text-white/90">
          {value}
        </div>
        <StepperButton
          label="Increase"
          onClick={increment}
          disabled={!canIncrement}
        >
          +
        </StepperButton>
      </div>
    </div>
  );
}

function StepperButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex w-11 shrink-0 items-center justify-center bg-gray-50 text-lg text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
}
