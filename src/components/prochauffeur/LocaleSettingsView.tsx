"use client";

import CompanySettingsSection from "@/components/company-profile/CompanySettingsSection";
import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import {
  formatTimeZoneOptionLabel,
  getLocaleTimeZoneOptions,
  LOCALE_COUNTRY_OPTIONS,
  LOCALE_DATE_FORMAT_OPTIONS,
  LOCALE_LANGUAGE_OPTIONS,
  LOCALE_NUMBER_FORMAT_OPTIONS,
  LOCALE_TIME_FORMAT_OPTIONS,
  type LocaleDateFormat,
  type LocaleNumberFormat,
  type LocaleTimeFormat,
} from "@/lib/prochauffeur/localeOptions";
import React, { useEffect, useMemo, useState } from "react";

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function LocaleSettingsView() {
  const {
    fleetLocale,
    saveFleetLocale,
    isSaving,
    actionError,
    clearActionError,
  } = useAdminOperations();

  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [dateFormat, setDateFormat] = useState<LocaleDateFormat | "">("");
  const [timeFormat, setTimeFormat] = useState<LocaleTimeFormat | "">("");
  const [timeZoneIdentifier, setTimeZoneIdentifier] = useState("");
  const [numberFormat, setNumberFormat] = useState<LocaleNumberFormat | "">("");

  const timeZoneOptions = useMemo(() => {
    const options = getLocaleTimeZoneOptions();
    const current = timeZoneIdentifier.trim();

    if (current && !options.some((option) => option.value === current)) {
      return [
        { value: current, label: formatTimeZoneOptionLabel(current) },
        ...options,
      ];
    }

    return options;
  }, [timeZoneIdentifier]);

  useEffect(() => {
    setLanguage(fleetLocale.language ?? "");
    setCountry(fleetLocale.country ?? "");
    setDateFormat(fleetLocale.dateFormat ?? "");
    setTimeFormat(fleetLocale.timeFormat ?? "");
    setTimeZoneIdentifier(fleetLocale.timeZoneIdentifier ?? "");
    setNumberFormat(fleetLocale.numberFormat ?? "");
  }, [fleetLocale]);

  function handleCancel() {
    setLanguage(fleetLocale.language ?? "");
    setCountry(fleetLocale.country ?? "");
    setDateFormat(fleetLocale.dateFormat ?? "");
    setTimeFormat(fleetLocale.timeFormat ?? "");
    setTimeZoneIdentifier(fleetLocale.timeZoneIdentifier ?? "");
    setNumberFormat(fleetLocale.numberFormat ?? "");
    clearActionError();
  }

  async function handleSave() {
    await saveFleetLocale({
      language: language.trim() || null,
      country: country.trim() || null,
      dateFormat: dateFormat || null,
      timeFormat: timeFormat || null,
      timeZoneIdentifier: timeZoneIdentifier.trim() || null,
      numberFormat: numberFormat || null,
    });
  }

  return (
    <CompanySettingsSection
      id="locale"
      title="Locale"
      description="Regional preferences for dates, times, numbers, and fleet scheduling."
      banner={
        actionError ? (
          <AdminActionBanner
            message={actionError}
            onDismiss={clearActionError}
          />
        ) : null
      }
      className="max-w-3xl"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="locale-country">Country</Label>
          <select
            id="locale-country"
            className={selectClassName}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Select country</option>
            {LOCALE_COUNTRY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Primary operating country for addresses and compliance defaults.
          </p>
        </div>

        <div>
          <Label htmlFor="locale-language">Language</Label>
          <select
            id="locale-language"
            className={selectClassName}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select language</option>
            {LOCALE_LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Default language for admin and customer-facing copy.
          </p>
        </div>

        <div>
          <Label htmlFor="locale-date-format">Date format</Label>
          <select
            id="locale-date-format"
            className={selectClassName}
            value={dateFormat}
            onChange={(e) =>
              setDateFormat(e.target.value as LocaleDateFormat | "")
            }
          >
            <option value="">Select date format</option>
            {LOCALE_DATE_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            How calendar dates appear across the dispatch console.
          </p>
        </div>

        <div>
          <Label htmlFor="locale-time-format">Time format</Label>
          <select
            id="locale-time-format"
            className={selectClassName}
            value={timeFormat}
            onChange={(e) =>
              setTimeFormat(e.target.value as LocaleTimeFormat | "")
            }
          >
            <option value="">Select time format</option>
            {LOCALE_TIME_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            12-hour or 24-hour clock for trip and activity timestamps.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="locale-timezone">Timezone</Label>
          <select
            id="locale-timezone"
            className={selectClassName}
            value={timeZoneIdentifier}
            onChange={(e) => setTimeZoneIdentifier(e.target.value)}
          >
            <option value="">Select timezone</option>
            {timeZoneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            IANA time zone used for dispatch scheduling and weekly operating
            patterns.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Label htmlFor="locale-number-format">Number format</Label>
          <select
            id="locale-number-format"
            className={selectClassName}
            value={numberFormat}
            onChange={(e) =>
              setNumberFormat(e.target.value as LocaleNumberFormat | "")
            }
          >
            <option value="">Select number format</option>
            {LOCALE_NUMBER_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Thousands separators and decimal style for fares and reports.
          </p>
        </div>
      </div>

      <div className="mt-6 flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
        <Button disabled={isSaving} onClick={handleSave}>
          {isSaving ? "Saving…" : "Save locale"}
        </Button>
        <Button variant="outline" disabled={isSaving} onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </CompanySettingsSection>
  );
}
