"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { vehicleDisplayName } from "@/lib/prochauffeur/vehicleHelpers";
import { VEHICLE_TYPE_LABELS } from "@/lib/prochauffeur/types";
import { displayNameForUser } from "@/lib/prochauffeur/display";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import Link from "next/link";
import React from "react";

export default function FleetManagementView() {
  const { vehicles, hasReceivedOperationsSnapshot, actionError, clearActionError } =
    useAdminOperations();
  const { userById } = useAdminDashboard();

  function chauffeurLabel(vehicle: (typeof vehicles)[number]): string {
    const assigned =
      vehicle.assignedChauffeurUserId === ""
        ? null
        : vehicle.assignedChauffeurUserId ?? vehicle.driverID;
    if (!assigned) return "Unassigned";
    return displayNameForUser(userById.get(assigned), assigned);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <PageBreadcrumb pageTitle="Fleet" />
        <Link href="/fleet/new">
          <Button size="sm">Add vehicle</Button>
        </Link>
      </div>

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      {!hasReceivedOperationsSnapshot ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading fleet…</p>
      ) : vehicles.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No fleet vehicles
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Add vehicles to assign them to chauffeurs and show them in booking.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {vehicles.map((vehicle) => (
            <Link
              key={vehicle.driverID}
              href={`/fleet/${vehicle.driverID}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white/90">
                    {vehicleDisplayName(vehicle)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {VEHICLE_TYPE_LABELS[vehicle.pricingVehicleType]} ·{" "}
                    {vehicle.licensePlate}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Chauffeur: {chauffeurLabel(vehicle)}
                  </p>
                </div>
                <span className="text-sm text-brand-500">Edit</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
