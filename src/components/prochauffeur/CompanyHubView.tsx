"use client";

import CompanyAddressCard from "@/components/company-profile/CompanyAddressCard";
import CompanyDetailsCard from "@/components/company-profile/CompanyDetailsCard";
import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import React from "react";

export default function CompanyHubView() {
  const { actionError, clearActionError } = useAdminOperations();

  return (
    <div>
      <PageBreadcrumb pageTitle="Overview" />

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      <div className="space-y-6">
        <CompanyDetailsCard />
        <CompanyAddressCard />
      </div>
    </div>
  );
}
