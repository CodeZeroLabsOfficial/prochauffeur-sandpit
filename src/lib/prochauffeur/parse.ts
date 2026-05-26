import type { DocumentData, Timestamp } from "firebase/firestore";
import type {
  AppUser,
  CoordinateField,
  GeoPointLike,
  Trip,
  TripStatus,
  UserProfile,
  UserRole,
  VehicleSnapshot,
} from "./types";

export function parseTimestamp(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as Timestamp).toDate();
  }
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  return new Date();
}

function parseCoordinate(value: unknown): CoordinateField {
  if (!value || typeof value !== "object") {
    return { latitude: 0, longitude: 0 };
  }
  const v = value as Record<string, unknown>;
  return {
    latitude: Number(v.latitude ?? 0),
    longitude: Number(v.longitude ?? 0),
  };
}

function parseGeoPoint(value: unknown): GeoPointLike | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if ("latitude" in v && "longitude" in v) {
    return {
      latitude: Number(v.latitude),
      longitude: Number(v.longitude),
    };
  }
  return null;
}

function parseUserProfile(value: unknown): UserProfile {
  if (!value || typeof value !== "object") {
    return { displayName: "" };
  }
  const v = value as Record<string, unknown>;
  return {
    displayName: String(v.displayName ?? ""),
    phoneNumber: v.phoneNumber != null ? String(v.phoneNumber) : null,
    photoURL: v.photoURL != null ? String(v.photoURL) : null,
    dateOfBirth: v.dateOfBirth ? parseTimestamp(v.dateOfBirth) : null,
  };
}

function parseVehicleSnapshot(value: unknown): VehicleSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  return {
    displayName: v.displayName != null ? String(v.displayName) : undefined,
    pricingVehicleType:
      v.pricingVehicleType != null ? String(v.pricingVehicleType) : undefined,
    make: v.make != null ? String(v.make) : undefined,
    model: v.model != null ? String(v.model) : undefined,
  };
}

export function parseTrip(id: string, data: DocumentData): Trip {
  return {
    id: String(data.id ?? id),
    status: data.status as TripStatus,
    customerID: String(data.customerID ?? ""),
    customerDisplayName:
      data.customerDisplayName != null
        ? String(data.customerDisplayName)
        : null,
    customerPhoneNumber:
      data.customerPhoneNumber != null
        ? String(data.customerPhoneNumber)
        : null,
    customerEmail:
      data.customerEmail != null ? String(data.customerEmail) : null,
    driverID: data.driverID != null ? String(data.driverID) : null,
    pickup: parseCoordinate(data.pickup),
    dropoff: parseCoordinate(data.dropoff),
    pickupAddressLine:
      data.pickupAddressLine != null ? String(data.pickupAddressLine) : null,
    dropoffAddressLine:
      data.dropoffAddressLine != null ? String(data.dropoffAddressLine) : null,
    vehicleSnapshot: parseVehicleSnapshot(data.vehicleSnapshot),
    fleetVehicleDocumentId:
      data.fleetVehicleDocumentId != null
        ? String(data.fleetVehicleDocumentId)
        : null,
    notes: data.notes != null ? String(data.notes) : null,
    bookingPassengerCount:
      data.bookingPassengerCount != null
        ? Number(data.bookingPassengerCount)
        : null,
    scheduledPickupAt: data.scheduledPickupAt
      ? parseTimestamp(data.scheduledPickupAt)
      : null,
    liveLocation: parseGeoPoint(data.liveLocation),
    liveHeadingDegrees:
      data.liveHeadingDegrees != null
        ? Number(data.liveHeadingDegrees)
        : null,
    createdAt: parseTimestamp(data.createdAt),
    updatedAt: parseTimestamp(data.updatedAt),
  };
}

export function parseUser(id: string, data: DocumentData): AppUser {
  return {
    id: String(data.id ?? id),
    role: data.role as UserRole,
    email: String(data.email ?? ""),
    profile: parseUserProfile(data.profile),
    createdAt: parseTimestamp(data.createdAt),
  };
}
