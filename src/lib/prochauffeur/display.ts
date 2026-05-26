import type { AppUser, Trip, TripStatus } from "./types";
import { TRIP_STATUS_LABELS } from "./types";

const summaryDateTime = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function displayNameForUser(
  user: AppUser | undefined,
  uid: string
): string {
  if (!user) return `User ${uid.slice(0, 8)}`;
  const name = user.profile.displayName.trim();
  if (name) return name;
  const email = user.email.trim();
  return email || `User ${uid.slice(0, 8)}`;
}

export function chauffeurDisplayName(
  userById: Map<string, AppUser>,
  driverID: string | null | undefined
): string {
  if (!driverID) return "Unassigned";
  const user = userById.get(driverID);
  if (!user) return `Driver ${driverID.slice(0, 8)}`;
  const name = user.profile.displayName.trim();
  if (name) return name;
  return user.role === "driver" ? "Chauffeur" : displayNameForUser(user, driverID);
}

export function customerDisplayName(
  trip: Trip,
  userById: Map<string, AppUser>
): string {
  const snapshot = trip.customerDisplayName?.trim();
  if (snapshot) return snapshot;
  return displayNameForUser(userById.get(trip.customerID), trip.customerID);
}

export function bookingCardDatePipeTime(date: Date): string {
  const datePart = date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${datePart} | ${timePart}`;
}

export function activityHeadline(status: TripStatus): string {
  switch (status) {
    case "requested":
      return "New trip request";
    case "accepted":
      return "Trip accepted";
    case "en_route_pickup":
      return "Chauffeur en route to pickup";
    case "in_progress":
      return "Trip in progress";
    case "completed":
      return "Trip completed";
    case "cancelled":
      return "Trip cancelled";
  }
}

export function formatSummaryDateTime(date: Date): string {
  return summaryDateTime.format(date);
}

export function vehicleSubtitle(trip: Trip): string {
  const v = trip.vehicleSnapshot;
  if (!v) return "Vehicle pending assignment";
  const display = v.displayName?.trim();
  if (display) {
    if (v.pricingVehicleType) {
      return `${v.pricingVehicleType} · ${display}`;
    }
    return display;
  }
  if (v.pricingVehicleType) return v.pricingVehicleType;
  return "Vehicle pending assignment";
}

export function statusLabel(status: TripStatus): string {
  return TRIP_STATUS_LABELS[status];
}
