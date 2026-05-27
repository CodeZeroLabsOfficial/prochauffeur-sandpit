"use client";

import AdminRosterView from "@/components/prochauffeur/AdminRosterView";
import BrandingSettingsView from "@/components/prochauffeur/BrandingSettingsView";
import CompanyPlaceholderView from "@/components/prochauffeur/CompanyPlaceholderView";
import LicenseManagementView from "@/components/prochauffeur/LicenseManagementView";
import LocaleSettingsView from "@/components/prochauffeur/LocaleSettingsView";
import React from "react";

export default function SettingsView() {
  return (
    <div className="space-y-6">
      <BrandingSettingsView />
      <LocaleSettingsView />
      <LicenseManagementView />
      <AdminRosterView />
      <CompanyPlaceholderView
        id="integrations"
        title="Integrations"
        description="Connect calendars, payments, telematics, and partner APIs."
        message="Connect calendars, payments, telematics, and partner APIs. Chauffeur operations rarely run on a single system — this hub will host those links when ready."
      />
    </div>
  );
}
