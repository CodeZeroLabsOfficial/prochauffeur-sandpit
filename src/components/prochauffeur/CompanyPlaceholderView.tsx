"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

type CompanyPlaceholderViewProps = {
  title: string;
  message: string;
};

export default function CompanyPlaceholderView({
  title,
  message,
}: CompanyPlaceholderViewProps) {
  return (
    <div>
      <PageBreadcrumb pageTitle={title} />
      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
}
