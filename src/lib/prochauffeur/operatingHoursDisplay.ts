import type { FleetWeeklyOperatingSchedule } from "./types";

const WEEKDAY_ORDER = [2, 3, 4, 5, 6, 7, 1] as const;

const WEEKDAY_LONG: Record<number, string> = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

function orderedWeekdays(numbers: number[]): number[] {
  const valid = new Set(numbers.filter((n) => n >= 1 && n <= 7));
  return WEEKDAY_ORDER.filter((n) => valid.has(n));
}

function formatDayRange(start: number, end: number): string {
  if (start === end) return WEEKDAY_LONG[start];
  return `${WEEKDAY_LONG[start]} – ${WEEKDAY_LONG[end]}`;
}

export function formatBusinessDays(weekdayNumbers: number[]): string {
  const ordered = orderedWeekdays(weekdayNumbers);
  if (ordered.length === 0) return "No days selected";
  if (ordered.length === 7) return "Every day";

  const segments: string[] = [];
  let rangeStart = ordered[0];
  let previous = ordered[0];

  for (let i = 1; i <= ordered.length; i++) {
    const current = ordered[i];
    const previousIndex = WEEKDAY_ORDER.indexOf(
      previous as (typeof WEEKDAY_ORDER)[number]
    );
    const currentIndex =
      current !== undefined
        ? WEEKDAY_ORDER.indexOf(current as (typeof WEEKDAY_ORDER)[number])
        : -1;

    if (currentIndex === previousIndex + 1) {
      previous = current;
      continue;
    }

    segments.push(formatDayRange(rangeStart, previous));
    if (current !== undefined) {
      rangeStart = current;
      previous = current;
    }
  }

  return segments.join(", ");
}

function formatTime12h(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) return time;

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${minutes} ${period}`;
}

export function formatBusinessHours(
  startTime: string | null,
  endTime: string | null
): string {
  if (!startTime && !endTime) return "Times not set";
  if (startTime && endTime) {
    return `${formatTime12h(startTime)} – ${formatTime12h(endTime)}`;
  }
  const single = startTime ?? endTime;
  return single ? formatTime12h(single) : "Times not set";
}

export function formatWeekStartsOn(weekday: number): string {
  return WEEKDAY_LONG[weekday] ?? "Monday";
}

export function formatTimeZoneLabel(timeZoneIdentifier: string | null): string {
  const id = timeZoneIdentifier?.trim();
  if (!id) return "Not set";

  try {
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: id,
      timeZoneName: "long",
    });
    const tzName = formatter
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")?.value;

    return tzName ?? id;
  } catch {
    return id;
  }
}

export function formatClosedDays(
  schedules: FleetWeeklyOperatingSchedule[]
): string {
  const openDays = new Set<number>();
  for (const schedule of schedules) {
    if (!schedule.isEnabled) continue;
    for (const day of schedule.weekdayNumbers) {
      if (day >= 1 && day <= 7) openDays.add(day);
    }
  }

  const closed = WEEKDAY_ORDER.filter((day) => !openDays.has(day));
  if (closed.length === 0) return "None";
  if (closed.length === 7) return "Every day";

  return closed.map((day) => WEEKDAY_LONG[day]).join(", ");
}
