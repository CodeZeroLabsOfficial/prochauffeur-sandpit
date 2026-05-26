"use client";

import CompanyAddressCard from "@/components/company-profile/CompanyAddressCard";
import CompanyDetailsCard from "@/components/company-profile/CompanyDetailsCard";
import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import React from "react";

export default function CompanyHubView() {
  const { actionError, clearActionError } = useAdminOperations();

  return (
    <CompanySettingsSection
      id="overview"
      title="Overview"
      description="Company profile, contact details, and registered address."
      banner={
        actionError ? (
          <AdminActionBanner
            message={actionError}
            onDismiss={clearActionError}
          />
        ) : null
      }
    >
      <div className="space-y-6">
        <CompanyDetailsCard />
        <CompanyAddressCard />
      </div>
    </CompanySettingsSection>
  );
}
