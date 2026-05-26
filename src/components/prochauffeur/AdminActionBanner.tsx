"use client";

import React from "react";

export default function AdminActionBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="mb-4 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-500">
      {message}
      {onDismiss ? (
        <button type="button" className="ml-3 underline" onClick={onDismiss}>
          Dismiss
        </button>
      ) : null}
    </div>
  );
}
