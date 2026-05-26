"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import Link from "next/link";
import React from "react";

export default function CompanyAboutView() {
  const { companyProfile } = useAdminOperations();
  const bio = companyProfile.bio.trim();

  return (
    <div>
      <PageBreadcrumb pageTitle="About your fleet" />

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        {bio ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {bio}
          </p>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add a short description travelers see when they choose your
            company — chauffeur heritage, safety pledge, or membership perks.
          </p>
        )}

        <Link href="/company" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Edit in company overview
          </Button>
        </Link>
      </div>
    </div>
  );
}
