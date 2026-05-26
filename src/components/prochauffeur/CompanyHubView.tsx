"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import Link from "next/link";
import React from "react";

const companyLinks = [
  {
    href: "/company/details",
    title: "Company details",
    description: "Name, contact info, logo, and public bio",
  },
  {
    href: "/company/hours",
    title: "Operating hours",
    description: "Fleet timezone and weekly dispatch windows",
  },
  {
    href: "/company/locations",
    title: "Locations",
    description: "Garages, yards, and satellite offices",
  },
  {
    href: "/company/license",
    title: "License management",
    description: "Subscription tier and seat usage",
  },
  {
    href: "/company/pricing",
    title: "Pricing",
    description: "Fare tiers, base rates, and bookable add-ons",
  },
  {
    href: "/company/admins",
    title: "Admin roster",
    description: "Administrator accounts and seat usage",
  },
  {
    href: "/company/integrations",
    title: "Integrations",
    description: "External services and API connections",
  },
  {
    href: "/company/guides",
    title: "Dispatch guides",
    description: "SOPs and venue notes for your team",
  },
  {
    href: "/company/about",
    title: "About your fleet",
    description: "Public bio shown to travelers",
  },
];

export default function CompanyHubView() {
  const { companyProfile } = useAdminOperations();
  const name = companyProfile.displayName.trim() || "Your company";

  return (
    <div>
      <PageBreadcrumb pageTitle="Company" />

      <div className="mb-8 flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-brand-500/10 text-lg font-semibold text-brand-500">
          {companyProfile.logoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={companyProfile.logoURL}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            name.slice(0, 1).toUpperCase()
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            {name}
          </h2>
          {companyProfile.address ? (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {companyProfile.address}
            </p>
          ) : null}
          {companyProfile.phone || companyProfile.email ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {[companyProfile.phone, companyProfile.email]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {companyLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-800"
          >
            <h3 className="font-medium text-gray-800 dark:text-white/90">
              {link.title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
