"use client";

import CompanyProfileEditButton from "@/components/company-profile/CompanyProfileEditButton";
import { displayValue } from "@/components/company-profile/displayValue";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import Image from "next/image";
import React from "react";

function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function CompanyMetaCard() {
  const { companyProfile } = useAdminOperations();
  const name = displayValue(companyProfile.displayName, "Your company");
  const subtitle = [companyProfile.phone, companyProfile.email]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" · ");
  const location = companyProfile.address.trim();

  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
            {companyProfile.logoURL.trim() ? (
              <Image
                width={80}
                height={80}
                src={companyProfile.logoURL}
                alt={`${name} logo`}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                {companyInitials(name)}
              </span>
            )}
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-white/90 xl:text-left">
              {name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              {subtitle ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Add contact details
                </p>
              )}
              {location ? (
                <>
                  <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {location}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <CompanyProfileEditButton />
      </div>
    </div>
  );
}
