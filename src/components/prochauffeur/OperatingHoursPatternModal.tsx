"use client";

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FormModal from "@/components/prochauffeur/FormModal";
import Button from "@/components/ui/button/Button";
import type { FleetWeeklyOperatingSchedule } from "@/lib/prochauffeur/types";
import { formatWeekStartsOn } from "@/lib/prochauffeur/operatingHoursDisplay";
import React, { useEffect, useState } from "react";

const WEEKDAY_OPTIONS = [
  { value: 2, label: "Mon" },
  { value: 3, label: "Tue" },
  { value: 4, label: "Wed" },
  { value: 5, label: "Thu" },
  { value: 6, label: "Fri" },
  { value: 7, label: "Sat" },
  { value: 1, label: "Sun" },
];

const WEEK_START_OPTIONS = [2, 3, 4, 5, 6, 7, 1].map((value) => ({
  value,
  label: formatWeekStartsOn(value),
}));

type OperatingHoursPatternModalProps = {
  isOpen: boolean;
  onClose: () => void;
  schedule: FleetWeeklyOperatingSchedule | null;
  weekStartsOn: number;
  isSaving: boolean;
  onSave: (
    schedule: FleetWeeklyOperatingSchedule,
    weekStartsOn: number
  ) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
};

export default function OperatingHoursPatternModal({
  isOpen,
  onClose,
  schedule,
  weekStartsOn,
  isSaving,
  onSave,
  onDelete,
}: OperatingHoursPatternModalProps) {
  const isNew = schedule == null;

  const [draft, setDraft] = useState<FleetWeeklyOperatingSchedule | null>(null);
  const [draftWeekStartsOn, setDraftWeekStartsOn] = useState(2);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(
      schedule ?? {
        id: crypto.randomUUID(),
        isEnabled: true,
        weekdayNumbers: [2, 3, 4, 5, 6],
        startTime: "09:00",
        endTime: "17:00",
      }
    );
    setDraftWeekStartsOn(weekStartsOn);
  }, [isOpen, schedule, weekStartsOn]);

  if (!draft) return null;

  function toggleWeekday(weekday: number) {
    setDraft((current) => {
      if (!current) return current;
      const hasDay = current.weekdayNumbers.includes(weekday);
      const weekdayNumbers = hasDay
        ? current.weekdayNumbers.filter((n) => n !== weekday)
        : [...current.weekdayNumbers, weekday];
      return { ...current, weekdayNumbers };
    });
  }

  async function handleSave() {
    if (!draft) return;
    const ok = await onSave(draft, draftWeekStartsOn);
    if (ok) onClose();
  }

  async function handleDelete() {
    if (!onDelete) return;
    const ok = await onDelete();
    if (ok) onClose();
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? "Add operating pattern" : "Edit operating pattern"}
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="week-starts-on">Week starts on</Label>
          <select
            id="week-starts-on"
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            value={draftWeekStartsOn}
            onChange={(e) => setDraftWeekStartsOn(Number(e.target.value))}
          >
            {WEEK_START_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={draft.isEnabled}
            onChange={(e) =>
              setDraft({ ...draft, isEnabled: e.target.checked })
            }
          />
          Pattern enabled
        </label>

        <div>
          <Label>Business days</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((day) => {
              const active = draft.weekdayNumbers.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  className={`rounded-lg px-3 py-1.5 text-sm ${
                    active
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                  onClick={() => toggleWeekday(day.value)}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Start time</Label>
            <Input
              type="time"
              value={draft.startTime ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  startTime: e.target.value || null,
                })
              }
            />
          </div>
          <div>
            <Label>End time</Label>
            <Input
              type="time"
              value={draft.endTime ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  endTime: e.target.value || null,
                })
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
          <div>
            {!isNew && onDelete ? (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => void handleDelete()}
                className="text-error-600 hover:text-error-700 dark:text-error-400"
              >
                Delete pattern
              </Button>
            ) : null}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={isSaving}
              onClick={() => void handleSave()}
            >
              {isSaving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
