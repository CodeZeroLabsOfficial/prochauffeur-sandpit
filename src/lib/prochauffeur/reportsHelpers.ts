import { tripVolumeSection } from "./tripVolume";
import type { Trip, TripStatus, TripVolumeChartPeriod } from "./types";

export type ReportMetrics = {
  totalTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  activeTrips: number;
  completionRate: number;
  tripsInPeriod: Trip[];
};

function tripsInVolumePeriod(
  trips: Trip[],
  period: TripVolumeChartPeriod,
  now: Date
): Trip[] {
  const { total } = tripVolumeSection(trips, period, now);
  void total;

  const startOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const nowDay = startOfDay(now);

  switch (period) {
    case "This Week": {
      const monday = (() => {
        const d = new Date(now);
        const day = d.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        d.setDate(d.getDate() + diff);
        return startOfDay(d);
      })();
      const weekEnd = new Date(monday);
      weekEnd.setDate(weekEnd.getDate() + 7);
      return trips.filter(
        (trip) => trip.createdAt >= monday && trip.createdAt < weekEnd
      );
    }
    case "This Month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return trips.filter(
        (trip) =>
          startOfDay(trip.createdAt) >= monthStart &&
          startOfDay(trip.createdAt) <= nowDay
      );
    }
    case "Last 3 Months": {
      const rangeStart = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return trips.filter(
        (trip) => trip.createdAt >= rangeStart && trip.createdAt < nextMonth
      );
    }
    case "This Year": {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const nextYear = new Date(now.getFullYear() + 1, 0, 1);
      return trips.filter(
        (trip) => trip.createdAt >= yearStart && trip.createdAt < nextYear
      );
    }
  }
}

export function computeReportMetrics(
  trips: Trip[],
  period: TripVolumeChartPeriod,
  now = new Date()
): ReportMetrics {
  const tripsInPeriod = tripsInVolumePeriod(trips, period, now);
  const completedTrips = tripsInPeriod.filter(
    (trip) => trip.status === "completed"
  ).length;
  const cancelledTrips = tripsInPeriod.filter(
    (trip) => trip.status === "cancelled"
  ).length;
  const activeTrips = tripsInPeriod.filter((trip) =>
    isActiveTripStatus(trip.status)
  ).length;
  const totalTrips = tripsInPeriod.length;
  const completionRate =
    totalTrips > 0 ? Math.round((completedTrips / totalTrips) * 100) : 0;

  return {
    totalTrips,
    completedTrips,
    cancelledTrips,
    activeTrips,
    completionRate,
    tripsInPeriod,
  };
}

function isActiveTripStatus(status: TripStatus): boolean {
  return (
    status === "requested" ||
    status === "accepted" ||
    status === "en_route_pickup" ||
    status === "in_progress"
  );
}

export function estimateRevenueFloor(
  completedTrips: number,
  minimumFare: number
): number {
  return completedTrips * minimumFare;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function statusBreakdown(trips: Trip[]): Record<TripStatus, number> {
  const counts: Record<TripStatus, number> = {
    requested: 0,
    accepted: 0,
    en_route_pickup: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const trip of trips) {
    counts[trip.status] += 1;
  }
  return counts;
}
