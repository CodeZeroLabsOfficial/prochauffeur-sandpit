"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { capLabel, displayNameForUser, resolvedDriverProfile } from "@/lib/prochauffeur/display";
import { CHAUFFEUR_CATEGORY_LABELS, type ChauffeurCategory } from "@/lib/prochauffeur/types";
import Link from "next/link";
import React from "react";

export default function DriversRosterView() {
  const { users } = useAdminDashboard();
  const { limits, hasReceivedOperationsSnapshot, actionError, clearActionError } =
    useAdminOperations();

  const drivers = users
    .filter((u) => u.role === "driver")
    .sort((a, b) =>
      displayNameForUser(a, a.id).localeCompare(
        displayNameForUser(b, b.id),
        undefined,
        { sensitivity: "base" }
      )
    );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <PageBreadcrumb pageTitle="Drivers" />
        <Link href="/drivers/new">
          <Button size="sm">Add driver</Button>
        </Link>
      </div>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {drivers.length}/{capLabel(limits.maxDrivers)} driver seats used
      </p>

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      {!hasReceivedOperationsSnapshot ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading drivers…
        </p>
      ) : drivers.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No drivers yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Driver accounts appear here once provisioned in Firebase.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {drivers.map((driver) => {
            const profile = resolvedDriverProfile(driver);
            return (
              <Link
                key={driver.id}
                href={`/drivers/${driver.id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white/90">
                      {displayNameForUser(driver, driver.id)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {CHAUFFEUR_CATEGORY_LABELS[profile.chauffeurCategory as ChauffeurCategory]} · {driver.email}
                    </p>
                  </div>
                  <span className="text-sm text-brand-500">Open</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
