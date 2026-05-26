"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import {
  CHAUFFEUR_CATEGORY_LABELS,
  type ChauffeurCategory,
} from "@/lib/prochauffeur/types";
import { resolvedDriverProfile } from "@/lib/prochauffeur/display";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const categories = Object.entries(CHAUFFEUR_CATEGORY_LABELS) as [
  ChauffeurCategory,
  string,
][];

export default function DriverProfileEditView({ userId }: { userId: string }) {
  const router = useRouter();
  const { userById } = useAdminDashboard();
  const { actionError, clearActionError, isSaving, saveDriverProfiles } =
    useAdminOperations();

  const driver = userById.get(userId);
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [category, setCategory] = useState<ChauffeurCategory>("chauffeur");
  const [bioStatement, setBioStatement] = useState("");
  const [visibleOnCustomerApp, setVisibleOnCustomerApp] = useState(true);
  const [acceptsDispatchAssignments, setAcceptsDispatchAssignments] =
    useState(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!driver) return;
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
    setVisibleOnCustomerApp(profile.visibleOnCustomerApp);
    setAcceptsDispatchAssignments(profile.acceptsDispatchAssignments);
  }, [driver]);

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
    const driverProfile = {
      ...resolvedDriverProfile(driver),
      chauffeurCategory: category,
      bioStatement: bioStatement.trim(),
      visibleOnCustomerApp,
      acceptsDispatchAssignments,
    };

    const ok = await saveDriverProfiles(userId, profile, driverProfile);
    if (ok) router.push(`/drivers/${userId}`);
  }

  if (!driver) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit profile" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Driver not found.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit profile" />

      {(actionError || localError) && (
        <AdminActionBanner
          message={localError ?? actionError ?? ""}
          onDismiss={() => {
            setLocalError(null);
            clearActionError();
          }}
        />
      )}

      <div className="max-w-2xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <Label>Display name</Label>
          <Input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display name"
          />
        </div>
        <div>
          <Label>Phone number</Label>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Phone number"
          />
        </div>
        <div>
          <Label>Date of birth</Label>
          <Input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>
        <div>
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
        <div>
          <Label>Bio for clients</Label>
          <TextArea
            rows={4}
            value={bioStatement}
            onChange={(v) => setBioStatement(v)}
            placeholder="Bio for clients"
          />
        </div>
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
            onChange={(e) => setAcceptsDispatchAssignments(e.target.checked)}
          />
          Accepts dispatch assignments
        </label>

        <div className="flex gap-3 pt-2">
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={() => router.push(`/drivers/${userId}`)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
