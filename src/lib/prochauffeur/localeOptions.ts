import { formatTimeZoneLabel } from "@/lib/prochauffeur/operatingHoursDisplay";

export type LocaleDateFormat = "dmy" | "mdy" | "ymd";
export type LocaleTimeFormat = "12h" | "24h";
export type LocaleNumberFormat = "western" | "european" | "space_comma";

export const LOCALE_LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "en-AU", label: "English (Australia)" },
  { value: "en-GB", label: "English (United Kingdom)" },
  { value: "en-US", label: "English (United States)" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "zh-Hans", label: "Chinese (Simplified)" },
] as const;

export const LOCALE_COUNTRY_OPTIONS = [
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "IE", label: "Ireland" },
  { value: "SG", label: "Singapore" },
  { value: "HK", label: "Hong Kong" },
  { value: "AE", label: "United Arab Emirates" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
] as const;

export const LOCALE_DATE_FORMAT_OPTIONS: {
  value: LocaleDateFormat;
  label: string;
}[] = [
  { value: "dmy", label: "Day / month / year (31/12/2026)" },
  { value: "mdy", label: "Month / day / year (12/31/2026)" },
  { value: "ymd", label: "Year / month / day (2026-12-31)" },
];

export const LOCALE_TIME_FORMAT_OPTIONS: {
  value: LocaleTimeFormat;
  label: string;
}[] = [
  { value: "12h", label: "12-hour (3:30 PM)" },
  { value: "24h", label: "24-hour (15:30)" },
];

export const LOCALE_NUMBER_FORMAT_OPTIONS: {
  value: LocaleNumberFormat;
  label: string;
}[] = [
  { value: "western", label: "1,234.56 (comma thousands, dot decimals)" },
  { value: "european", label: "1.234,56 (dot thousands, comma decimals)" },
  {
    value: "space_comma",
    label: "1 234,56 (space thousands, comma decimals)",
  },
];

const DATE_FORMATS = new Set<LocaleDateFormat>(["dmy", "mdy", "ymd"]);
const TIME_FORMATS = new Set<LocaleTimeFormat>(["12h", "24h"]);
const NUMBER_FORMATS = new Set<LocaleNumberFormat>([
  "western",
  "european",
  "space_comma",
]);

export function parseLocaleDateFormat(
  value: unknown
): LocaleDateFormat | null {
  const s = typeof value === "string" ? value : "";
  return DATE_FORMATS.has(s as LocaleDateFormat)
    ? (s as LocaleDateFormat)
    : null;
}

export function parseLocaleTimeFormat(
  value: unknown
): LocaleTimeFormat | null {
  const s = typeof value === "string" ? value : "";
  return TIME_FORMATS.has(s as LocaleTimeFormat)
    ? (s as LocaleTimeFormat)
    : null;
}

export function parseLocaleNumberFormat(
  value: unknown
): LocaleNumberFormat | null {
  const s = typeof value === "string" ? value : "";
  return NUMBER_FORMATS.has(s as LocaleNumberFormat)
    ? (s as LocaleNumberFormat)
    : null;
}

const FALLBACK_TIME_ZONE_OPTIONS = [
  "Pacific/Auckland",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Europe/London",
  "Europe/Paris",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
] as const;

export function formatTimeZoneOptionLabel(timeZoneIdentifier: string): string {
  const id = timeZoneIdentifier.trim();
  if (!id) return id;

  const name = formatTimeZoneLabel(id);
  return name === id ? id : `${name} (${id})`;
}

let cachedTimeZoneOptions: { value: string; label: string }[] | null = null;

export function getLocaleTimeZoneOptions(): { value: string; label: string }[] {
  if (cachedTimeZoneOptions) return cachedTimeZoneOptions;

  const identifiers =
    typeof Intl !== "undefined" &&
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [...FALLBACK_TIME_ZONE_OPTIONS];

  cachedTimeZoneOptions = identifiers
    .map((value) => ({
      value,
      label: formatTimeZoneOptionLabel(value),
    }))
    .sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base" })
    );

  return cachedTimeZoneOptions;
}
