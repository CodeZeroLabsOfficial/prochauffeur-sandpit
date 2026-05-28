"use client";

import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import DriverDetailsCard from "@/components/driver-profile/DriverDetailsCard";
import DriverDispatchCard from "@/components/driver-profile/DriverDispatchCard";
import DriverFleetCard from "@/components/driver-profile/DriverFleetCard";
import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function DriverOverviewView({ userId }: { userId: string }) {
  const router = useRouter();
  const { appUser: sessionUser } = useAuth();
  const { userById } = useAdminDashboard();
  const { actionError, clearActionError, deleteDriver, isSaving } =
    useAdminOperations();

  const driver = userById.get(userId);
  const canDelete =
    driver?.role === "driver" && driver.id !== sessionUser?.id;
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    const ok = await deleteDriver(userId);
    if (ok) router.push("/drivers");
  }

  if (!driver) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Driver not found.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <CompanySettingsSection
        id="overview"
        title="Overview"
        description="Driver profile, dispatch preferences, and fleet assignment."
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
          <DriverDetailsCard userId={userId} />
          <DriverDispatchCard userId={userId} />
          <DriverFleetCard userId={userId} />
        </div>
      </CompanySettingsSection>

      {canDelete ? (
        <div className="rounded-2xl border border-error-500/20 bg-error-500/5 p-5 lg:p-6">
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
