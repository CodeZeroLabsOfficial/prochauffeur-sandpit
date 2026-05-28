"use client";

import SettingsEditableCard from "@/components/company-profile/SettingsEditableCard";
import { displayYesNo } from "@/components/driver-profile/driverDisplay";
import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormDescription,
  ModalFormFooterActions,
} from "@/components/prochauffeur/modalShell";
import Button from "@/components/ui/button/Button";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useModal } from "@/hooks/useModal";
import { resolvedDriverProfile } from "@/lib/prochauffeur/display";
import React, { useEffect, useState } from "react";

type DriverDispatchCardProps = {
  userId: string;
};

export default function DriverDispatchCard({ userId }: DriverDispatchCardProps) {
  const { userById } = useAdminDashboard();
  const { saveDriverProfiles, isSaving } = useAdminOperations();
  const { isOpen, openModal, closeModal } = useModal();

  const driver = userById.get(userId);
  const driverProfile = resolvedDriverProfile(driver);

  const [visibleOnCustomerApp, setVisibleOnCustomerApp] = useState(true);
  const [acceptsDispatchAssignments, setAcceptsDispatchAssignments] =
    useState(true);

  useEffect(() => {
    if (!isOpen || !driver) return;
    const profile = resolvedDriverProfile(driver);
    setVisibleOnCustomerApp(profile.visibleOnCustomerApp);
    setAcceptsDispatchAssignments(profile.acceptsDispatchAssignments);
  }, [isOpen, driver]);

  if (!driver) {
    return null;
  }

  async function handleSave() {
    if (!driver) return;

    const ok = await saveDriverProfiles(userId, driver.profile, {
      ...resolvedDriverProfile(driver),
      visibleOnCustomerApp,
      acceptsDispatchAssignments,
    });
    if (ok) closeModal();
  }

  return (
    <>
      <SettingsEditableCard
        onEdit={openModal}
        editAriaLabel="Edit dispatch preferences"
      >
        <h4 className="pe-10 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Dispatch preferences
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Visible on customer app
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayYesNo(driverProfile.visibleOnCustomerApp)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Accepts dispatch assignments
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayYesNo(driverProfile.acceptsDispatchAssignments)}
            </p>
          </div>
        </div>
      </SettingsEditableCard>

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit dispatch preferences"
        footer={
          <ModalFormFooterActions>
            <Button
              size="sm"
              variant="outline"
              onClick={closeModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={isSaving} onClick={() => void handleSave()}>
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </ModalFormFooterActions>
        }
      >
        <ModalFormDescription>
          Control whether this chauffeur appears to customers and can receive
          dispatch assignments.
        </ModalFormDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
        >
          <div className="space-y-4">
            <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={visibleOnCustomerApp}
                onChange={(e) => setVisibleOnCustomerApp(e.target.checked)}
              />
              Visible on customer app
            </label>
            <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={acceptsDispatchAssignments}
                onChange={(e) =>
                  setAcceptsDispatchAssignments(e.target.checked)
                }
              />
              Accepts dispatch assignments
            </label>
          </div>
        </form>
      </FormModal>
    </>
  );
}
