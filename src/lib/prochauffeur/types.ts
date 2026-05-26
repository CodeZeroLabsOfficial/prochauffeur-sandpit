export type UserRole = "customer" | "driver" | "admin";

export type TripStatus =
  | "requested"
  | "accepted"
  | "en_route_pickup"
  | "in_progress"
  | "completed"
  | "cancelled";

export type CoordinateField = {
  latitude: number;
  longitude: number;
};

export type GeoPointLike = {
  latitude: number;
  longitude: number;
};

export type UserProfile = {
  displayName: string;
  phoneNumber?: string | null;
  photoURL?: string | null;
  dateOfBirth?: Date | null;
};

export type AppUser = {
  id: string;
  role: UserRole;
  email: string;
  profile: UserProfile;
  createdAt: Date;
};

export type VehicleSnapshot = {
  displayName?: string;
  pricingVehicleType?: string;
  make?: string;
  model?: string;
};

export type Trip = {
  id: string;
  status: TripStatus;
  customerID: string;
  customerDisplayName?: string | null;
  customerPhoneNumber?: string | null;
  customerEmail?: string | null;
  driverID?: string | null;
  pickup: CoordinateField;
  dropoff: CoordinateField;
  pickupAddressLine?: string | null;
  dropoffAddressLine?: string | null;
  vehicleSnapshot?: VehicleSnapshot | null;
  fleetVehicleDocumentId?: string | null;
  notes?: string | null;
  bookingPassengerCount?: number | null;
  scheduledPickupAt?: Date | null;
  liveLocation?: GeoPointLike | null;
  liveHeadingDegrees?: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TripVolumeChartPeriod =
  | "This Week"
  | "This Month"
  | "Last 3 Months"
  | "This Year";

export type TripVolumeBarPoint = {
  id: string;
  label: string;
  count: number;
};

export type AdminActivityItem = {
  id: string;
  headline: string;
  subline: string;
  occurredAt: Date;
};

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  requested: "Requested",
  accepted: "Accepted",
  en_route_pickup: "Enroute",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const UPCOMING_TRIP_STATUSES: TripStatus[] = [
  "requested",
  "accepted",
  "en_route_pickup",
  "in_progress",
];

export function isUpcomingTripStatus(status: TripStatus): boolean {
  return UPCOMING_TRIP_STATUSES.includes(status);
}

export function tripStatusBadgeColor(
  status: TripStatus
): "primary" | "success" | "warning" | "error" | "info" | "light" | "dark" {
  switch (status) {
    case "requested":
      return "warning";
    case "accepted":
      return "primary";
    case "en_route_pickup":
    case "in_progress":
      return "info";
    case "completed":
      return "success";
    case "cancelled":
      return "error";
  }
}
