import type { Trip, TripVolumeBarPoint, TripVolumeChartPeriod } from "./types";

const monthAbbrev = new Intl.DateTimeFormat("en", { month: "short" });

function mondayStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function tripVolumeThisWeek(
  trips: Trip[],
  now: Date
): { bars: TripVolumeBarPoint[]; total: number } {
  const weekStart = mondayStartOfWeek(now);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const dayCounts = new Map<number, number>();
  let total = 0;
  for (const trip of trips) {
    if (trip.createdAt < weekStart || trip.createdAt >= weekEnd) continue;
    total += 1;
    const key = startOfDay(trip.createdAt).getTime();
    dayCounts.set(key, (dayCounts.get(key) ?? 0) + 1);
  }

  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const bars: TripVolumeBarPoint[] = labels.map((label, offset) => {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + offset);
    const count = dayCounts.get(startOfDay(day).getTime()) ?? 0;
    return { id: `w-${offset}`, label, count };
  });

  return { bars, total };
}

function tripVolumeThisMonth(
  trips: Trip[],
  now: Date
): { bars: TripVolumeBarPoint[]; total: number } {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const todayStart = startOfDay(now);
  const dayCounts = new Map<number, number>();
  let total = 0;

  for (const trip of trips) {
    const d = startOfDay(trip.createdAt);
    if (d < monthStart || d > todayStart) continue;
    total += 1;
    dayCounts.set(d.getTime(), (dayCounts.get(d.getTime()) ?? 0) + 1);
  }

  const bars: TripVolumeBarPoint[] = [];
  const cursor = new Date(monthStart);
  while (cursor <= todayStart) {
    const dayStart = startOfDay(cursor);
    bars.push({
      id: `m-${cursor.getDate()}`,
      label: String(cursor.getDate()),
      count: dayCounts.get(dayStart.getTime()) ?? 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return { bars, total };
}

function tripVolumeLastThreeMonths(
  trips: Trip[],
  now: Date
): { bars: TripVolumeBarPoint[]; total: number } {
  const m0 = new Date(now.getFullYear(), now.getMonth(), 1);
  const m1 = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const m2 = new Date(now.getFullYear(), now.getMonth() - 2, 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const months = [m2, m1, m0];

  const intervals = months.map((monthStart) => {
    const endOfMonth = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0
    );
    return {
      start: startOfDay(monthStart),
      end: startOfDay(endOfMonth),
    };
  });

  const barCounts = [0, 0, 0];
  let total = 0;
  for (const trip of trips) {
    if (trip.createdAt >= m2 && trip.createdAt < nextMonth) total += 1;
    const d = startOfDay(trip.createdAt);
    for (let idx = 0; idx < 3; idx += 1) {
      const { start, end } = intervals[idx];
      if (d >= start && d <= end) {
        barCounts[idx] += 1;
        break;
      }
    }
  }

  const bars = months.map((monthStart, idx) => ({
    id: `q-${idx}`,
    label: monthAbbrev.format(monthStart),
    count: barCounts[idx],
  }));

  return { bars, total };
}

function tripVolumeThisYear(
  trips: Trip[],
  now: Date
): { bars: TripVolumeBarPoint[]; total: number } {
  const year = now.getFullYear();
  const yearStart = new Date(year, 0, 1);
  const nextYear = new Date(year + 1, 0, 1);
  const barCounts = Array.from({ length: 12 }, () => 0);
  let total = 0;

  for (const trip of trips) {
    if (trip.createdAt >= yearStart && trip.createdAt < nextYear) total += 1;
    const d = startOfDay(trip.createdAt);
    if (d.getFullYear() !== year) continue;
    barCounts[d.getMonth()] += 1;
  }

  const bars = barCounts.map((count, monthOffset) => ({
    id: `y-${monthOffset}`,
    label: monthAbbrev.format(new Date(year, monthOffset, 1)),
    count,
  }));

  return { bars, total };
}

export function tripVolumeSection(
  trips: Trip[],
  period: TripVolumeChartPeriod,
  now = new Date()
): { bars: TripVolumeBarPoint[]; total: number } {
  switch (period) {
    case "This Week":
      return tripVolumeThisWeek(trips, now);
    case "This Month":
      return tripVolumeThisMonth(trips, now);
    case "Last 3 Months":
      return tripVolumeLastThreeMonths(trips, now);
    case "This Year":
      return tripVolumeThisYear(trips, now);
  }
}

export const TRIP_VOLUME_PERIODS: TripVolumeChartPeriod[] = [
  "This Week",
  "This Month",
  "Last 3 Months",
  "This Year",
];
