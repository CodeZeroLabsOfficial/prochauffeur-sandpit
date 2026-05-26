"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { capLabel } from "@/lib/prochauffeur/display";
import Link from "next/link";
import React from "react";

export default function LocationsView() {
  const {
    locations,
    limits,
    hasReceivedOperationsSnapshot,
    actionError,
    clearActionError,
  } = useAdminOperations();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <PageBreadcrumb pageTitle="Locations" />
        <Link href="/company/locations/new">
          <Button size="sm">Add location</Button>
        </Link>
      </div>

      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        {locations.length}/{capLabel(limits.maxLocations)} dispatch locations
      </p>

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      {!hasReceivedOperationsSnapshot ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading locations…
        </p>
      ) : locations.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No locations yet
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add yards, offices, or satellite bases used by dispatch.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/company/locations/${location.id}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-800"
            >
              <h3 className="font-semibold text-gray-800 dark:text-white/90">
                {location.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {location.addressLine}
              </p>
              <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
