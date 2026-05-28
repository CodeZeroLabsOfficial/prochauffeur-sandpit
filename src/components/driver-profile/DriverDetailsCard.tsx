"use client";

import SettingsEditableCard from "@/components/company-profile/SettingsEditableCard";
import { displayValue } from "@/components/company-profile/displayValue";
import {
  displayOptionalDate,
  driverAvatarColorClass,
  driverInitials,
} from "@/components/driver-profile/driverDisplay";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormDescription,
  ModalFormFooterActions,
} from "@/components/prochauffeur/modalShell";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useModal } from "@/hooks/useModal";
import {
  displayNameForUser,
  resolvedDriverProfile,
} from "@/lib/prochauffeur/display";
import {
  CHAUFFEUR_CATEGORY_LABELS,
  type ChauffeurCategory,
} from "@/lib/prochauffeur/types";
import React, { useEffect, useState } from "react";

const categories = Object.entries(CHAUFFEUR_CATEGORY_LABELS) as [
  ChauffeurCategory,
  string,
][];

type DriverDetailsCardProps = {
  userId: string;
};

export default function DriverDetailsCard({ userId }: DriverDetailsCardProps) {
  const { userById } = useAdminDashboard();
  const { saveDriverProfiles, isSaving } = useAdminOperations();
  const { isOpen, openModal, closeModal } = useModal();

  const driver = userById.get(userId);
  const driverProfile = resolvedDriverProfile(driver);

  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [category, setCategory] = useState<ChauffeurCategory>("chauffeur");
  const [bioStatement, setBioStatement] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !driver) return;
    const profile = resolvedDriverProfile(driver);
    setDisplayName(driver.profile.displayName);
    setPhoneNumber(driver.profile.phoneNumber ?? "");
    setDateOfBirth(
      driver.profile.dateOfBirth
        ? driver.profile.dateOfBirth.toISOString().slice(0, 10)
        : ""
    );
    setCategory(profile.chauffeurCategory);
    setBioStatement(profile.bioStatement);
    setLocalError(null);
  }, [isOpen, driver]);

  if (!driver) {
    return null;
  }

  const name = displayNameForUser(driver, driver.id);
  const roleLabel =
    CHAUFFEUR_CATEGORY_LABELS[
      driverProfile.chauffeurCategory as ChauffeurCategory
    ] ?? driverProfile.chauffeurCategory;

  async function handleSave() {
    if (!driver) return;
    if (!displayName.trim()) {
      setLocalError("Display name is required.");
      return;
    }
    if (!bioStatement.trim()) {
      setLocalError("Bio for clients is required.");
      return;
    }
    setLocalError(null);

    const profile = {
      ...driver.profile,
      displayName: displayName.trim(),
      phoneNumber: phoneNumber.trim() || null,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    };
    const nextDriverProfile = {
      ...resolvedDriverProfile(driver),
      chauffeurCategory: category,
      bioStatement: bioStatement.trim(),
    };

    const ok = await saveDriverProfiles(userId, profile, nextDriverProfile);
    if (ok) closeModal();
  }

  return (
    <>
      <SettingsEditableCard
        onEdit={openModal}
        editAriaLabel="Edit driver profile"
      >
        <div className="flex flex-col gap-5 pe-10 xl:flex-row xl:items-center">
          <div className="flex w-full flex-col items-center gap-6 xl:flex-row">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full text-xl font-semibold text-white ${driverAvatarColorClass(driver.id)}`}
            >
              {driverInitials(name)}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-white/90 xl:text-left">
                {name}
              </h4>
              <div className="text-center xl:text-left">
                <Badge variant="light" color="primary">
                  {roleLabel}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:grid-cols-3 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Display name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(driver.profile.displayName)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(driver.email)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Phone
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(driver.profile.phoneNumber ?? "")}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Date of birth
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayOptionalDate(driver.profile.dateOfBirth)}
            </p>
          </div>
        </div>
      </SettingsEditableCard>

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit driver profile"
        size="lg"
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
          Update this chauffeur&apos;s profile details and client-facing bio.
        </ModalFormDescription>
        {localError ? (
          <p className="mb-4 text-sm text-error-500">{localError}</p>
        ) : null}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>Display name</Label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Phone number</Label>
              <Input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Date of birth</Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Label>Chauffeur role</Label>
              <select
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                value={category}
                onChange={(e) => setCategory(e.target.value as ChauffeurCategory)}
              >
                {categories.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Label>Bio for clients</Label>
              <TextArea
                rows={4}
                value={bioStatement}
                onChange={setBioStatement}
              />
            </div>
          </div>
        </form>
      </FormModal>
    </>
  );
}
