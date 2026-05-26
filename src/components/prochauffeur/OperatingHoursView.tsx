"use client";

import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import OperatingHoursPatternModal from "@/components/prochauffeur/OperatingHoursPatternModal";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useModal } from "@/hooks/useModal";
import { PencilIcon } from "@/icons/index";
import {
  formatBusinessDays,
  formatBusinessHours,
  formatTimeZoneLabel,
  formatWeekStartsOn,
} from "@/lib/prochauffeur/operatingHoursDisplay";
import type { FleetWeeklyOperatingSchedule } from "@/lib/prochauffeur/types";
import React, { useState } from "react";

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
        {value}
      </p>
    </div>
  );
}

type PatternCardProps = {
  schedule: FleetWeeklyOperatingSchedule;
  timeZoneLabel: string;
  weekStartsOn: number;
  onEdit: () => void;
};

function OperatingHoursPatternCard({
  schedule,
  timeZoneLabel,
  weekStartsOn,
  onEdit,
}: PatternCardProps) {
  const businessDays = schedule.isEnabled
    ? formatBusinessDays(schedule.weekdayNumbers)
    : "Disabled";

  const businessHours = schedule.isEnabled
    ? formatBusinessHours(schedule.startTime, schedule.endTime)
    : "—";

  return (
    <div className="relative rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
      <button
        type="button"
        onClick={onEdit}
        aria-label="Edit pattern"
        className="absolute right-5 top-5 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200"
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      <div className="grid grid-cols-1 gap-4 pe-10 sm:grid-cols-2 sm:gap-6">
        <SummaryField label="Business days" value={businessDays} />
        <SummaryField label="Business hours" value={businessHours} />
        <SummaryField label="Timezone" value={timeZoneLabel} />
        <SummaryField
          label="Week starts on"
          value={formatWeekStartsOn(weekStartsOn)}
        />
      </div>
    </div>
  );
}

export default function OperatingHoursView() {
  const {
    operatingHours,
    fleetLocale,
    saveOperatingHours,
    isSaving,
    actionError,
    clearActionError,
  } = useAdminOperations();

  const { isOpen, openModal, closeModal } = useModal();
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const timeZoneLabel = formatTimeZoneLabel(
    fleetLocale.timeZoneIdentifier ?? operatingHours.timeZoneIdentifier
  );

  const editingSchedule = isCreating
    ? null
    : editingScheduleId != null
      ? (operatingHours.schedules.find((s) => s.id === editingScheduleId) ??
        null)
      : null;

  function openCreateModal() {
    setEditingScheduleId(null);
    setIsCreating(true);
    openModal();
  }

  function openEditModal(scheduleId: string) {
    setIsCreating(false);
    setEditingScheduleId(scheduleId);
    openModal();
  }

  function closePatternModal() {
    closeModal();
    setEditingScheduleId(null);
    setIsCreating(false);
  }

  async function persistSchedules(
    schedules: FleetWeeklyOperatingSchedule[],
    weekStartsOn: number
  ) {
    return saveOperatingHours({
      timeZoneIdentifier: operatingHours.timeZoneIdentifier,
      weekStartsOn,
      schedules,
    });
  }

  async function handleSavePattern(
    schedule: FleetWeeklyOperatingSchedule,
    weekStartsOn: number
  ) {
    clearActionError();
    const schedules = isCreating
      ? [...operatingHours.schedules, schedule]
      : operatingHours.schedules.map((item) =>
          item.id === schedule.id ? schedule : item
        );
    return persistSchedules(schedules, weekStartsOn);
  }

  async function handleDeletePattern() {
    if (editingScheduleId == null) return false;
    clearActionError();
    const schedules = operatingHours.schedules.filter(
      (item) => item.id !== editingScheduleId
    );
    return persistSchedules(schedules, operatingHours.weekStartsOn);
  }

  return (
    <>
      <CompanySettingsSection
        id="operating-hours"
        title="Operating hours"
        description="Define when your fleet dispatches trips."
        actions={
          <Button size="sm" variant="outline" onClick={openCreateModal}>
            Add pattern
          </Button>
        }
        banner={
          actionError ? (
            <AdminActionBanner
              message={actionError}
              onDismiss={clearActionError}
            />
          ) : null
        }
        className="max-w-3xl space-y-6"
      >
        <div>
          <h4 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            Weekly patterns
          </h4>

          {operatingHours.schedules.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No operating patterns yet. Add one to define when the fleet
              dispatches.
            </p>
          ) : (
            <div className="space-y-4">
              {operatingHours.schedules.map((schedule) => (
                <OperatingHoursPatternCard
                  key={schedule.id}
                  schedule={schedule}
                  timeZoneLabel={timeZoneLabel}
                  weekStartsOn={operatingHours.weekStartsOn}
                  onEdit={() => openEditModal(schedule.id)}
                />
              ))}
            </div>
          )}
        </div>
      </CompanySettingsSection>

      <OperatingHoursPatternModal
        isOpen={isOpen}
        onClose={closePatternModal}
        schedule={editingSchedule}
        weekStartsOn={operatingHours.weekStartsOn}
        isSaving={isSaving}
        onSave={handleSavePattern}
        onDelete={
          isCreating || editingScheduleId == null
            ? undefined
            : handleDeletePattern
        }
      />
    </>
  );
}
