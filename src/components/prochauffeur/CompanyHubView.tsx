"use client";

import CompanyAddressCard from "@/components/company-profile/CompanyAddressCard";
import CompanyInfoCard from "@/components/company-profile/CompanyInfoCard";
import CompanyMetaCard from "@/components/company-profile/CompanyMetaCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React from "react";

export default function CompanyHubView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Overview" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Company overview
        </h3>
        <div className="space-y-6">
          <CompanyMetaCard />
          <CompanyInfoCard />
          <CompanyAddressCard />
        </div>
      </div>
    </div>
  );
}
