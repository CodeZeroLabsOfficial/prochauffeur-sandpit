import type { AdminActivityItem } from "./types";

export type ActivityTimeRange = "today" | "last7" | "last30";

export const ACTIVITY_TIME_RANGES: {
  id: ActivityTimeRange;
  label: string;
}[] = [
  { id: "today", label: "Today" },
  { id: "last7", label: "Last 7 days" },
  { id: "last30", label: "Last 30 days" },
];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function activityRangeLowerBound(
  range: ActivityTimeRange,
  now = new Date()
): Date {
  const startOfToday = startOfDay(now);
  switch (range) {
    case "today":
      return startOfToday;
    case "last7": {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - 6);
      return d;
    }
    case "last30": {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - 29);
      return d;
    }
  }
}

export function filterActivityItems(
  items: AdminActivityItem[],
  range: ActivityTimeRange,
  now = new Date()
): AdminActivityItem[] {
  const lower = activityRangeLowerBound(range, now);
  return items.filter(
    (item) => item.occurredAt >= lower && item.occurredAt <= now
  );
}
