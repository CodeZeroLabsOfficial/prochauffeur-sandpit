"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import {
  CHAUFFEUR_CATEGORY_LABELS,
  type ChauffeurCategory,
} from "@/lib/prochauffeur/types";
import {
  displayNameForUser,
  resolvedDriverProfile,
} from "@/lib/prochauffeur/display";
import { vehicleDisplayName } from "@/lib/prochauffeur/vehicleHelpers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const hubLinks = [
  { href: "profile", label: "Profile", description: "Name, role, bio, visibility" },
  { href: "vehicle", label: "Vehicle assignment", description: "Link a fleet vehicle" },
  { href: "availability", label: "Availability", description: "Weekly schedules (coming soon)" },
  { href: "license", label: "Driver licence", description: "Compliance details (coming soon)" },
  { href: "accreditation", label: "Accreditation", description: "Operator credentials (coming soon)" },
  { href: "service-focus", label: "Service focus", description: "Specialties and tiers (coming soon)" },
];

export default function DriverHubView({ userId }: { userId: string }) {
  const router = useRouter();
  const { appUser: sessionUser } = useAuth();
  const { userById } = useAdminDashboard();
  const {
    actionError,
    clearActionError,
    deleteDriver,
    isSaving,
    vehicleForChauffeur,
  } = useAdminOperations();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const driver = userById.get(userId);
  const driverProfile = resolvedDriverProfile(driver);
  const assignedVehicle = vehicleForChauffeur(userId);
  const canDelete =
    driver?.role === "driver" && driver.id !== sessionUser?.id;

  async function handleDelete() {
    const ok = await deleteDriver(userId);
    if (ok) router.push("/drivers");
  }

  if (!driver) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Driver" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Driver not found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Driver" />

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {displayNameForUser(driver, driver.id)}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {CHAUFFEUR_CATEGORY_LABELS[driverProfile.chauffeurCategory as ChauffeurCategory] ??
            driverProfile.chauffeurCategory}{" "}
          · {driver.email}
        </p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {assignedVehicle
            ? `Assigned vehicle: ${vehicleDisplayName(assignedVehicle)} (${assignedVehicle.licensePlate})`
            : "No fleet vehicle assigned"}
        </p>
      </div>

      <div className="space-y-3">
        {hubLinks.map((link) => (
          <Link
            key={link.href}
            href={`/drivers/${userId}/${link.href}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-800"
          >
            <h3 className="font-medium text-gray-800 dark:text-white/90">
              {link.label}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {link.description}
            </p>
          </Link>
        ))}
      </div>

      {canDelete ? (
        <div className="mt-8 rounded-2xl border border-error-500/20 bg-error-500/5 p-5">
          <h3 className="font-medium text-error-500">Delete driver</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Removes the driver Auth account, user document, and linked vehicle
            document via the deleteDriverAuth Cloud Function.
          </p>
          {!confirmDelete ? (
            <Button
              className="mt-4 !bg-error-500 hover:!bg-error-600"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              Delete driver
            </Button>
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                className="!bg-error-500 hover:!bg-error-600"
                size="sm"
                disabled={isSaving}
                onClick={handleDelete}
              >
                {isSaving ? "Deleting…" : "Confirm delete"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isSaving}
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
