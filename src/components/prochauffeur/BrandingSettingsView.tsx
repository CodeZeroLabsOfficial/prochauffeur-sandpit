"use client";

import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import React from "react";

export default function BrandingSettingsView() {
  return (
    <CompanySettingsSection
      id="branding"
      title="Branding"
      description="Customize the favicon and logos shown across your web admin and customer-facing experiences."
      className="max-w-3xl"
    >
      <div className="space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        <p>
          Fleet-specific artwork helps travelers recognize bookings and reinforces
          your brand wherever the app surfaces your company identity.
        </p>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Favicon
          </h4>
          <p className="mt-1 max-w-2xl">
            The small icon displayed in browser tabs and when customers save your
            site. Upload support and live preview are coming soon.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Logos
          </h4>
          <p className="mt-1 max-w-2xl">
            Primary and compact marks for the header, sign-in, emails, and other
            surfaces will be configurable here so one set of assets stays
            consistent across the product.
          </p>
        </div>
      </div>
    </CompanySettingsSection>
  );
}
