"use client";

import CompanyProfileEditButton from "@/components/company-profile/CompanyProfileEditButton";
import { displayValue } from "@/components/company-profile/displayValue";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import React from "react";

export default function CompanyAddressCard() {
  const { companyProfile } = useAdminOperations();

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Address
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Business address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {displayValue(companyProfile.address)}
              </p>
            </div>
          </div>
        </div>

        <CompanyProfileEditButton />
      </div>
    </div>
  );
}
