"use client";

import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import React from "react";

type CompanyPlaceholderViewProps = {
  id: string;
  title: string;
  message: string;
  description?: string;
};

export default function CompanyPlaceholderView({
  id,
  title,
  message,
  description,
}: CompanyPlaceholderViewProps) {
  return (
    <CompanySettingsSection
      id={id}
      title={title}
      description={description}
    >
      <p className="max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {message}
      </p>
    </CompanySettingsSection>
  );
}
