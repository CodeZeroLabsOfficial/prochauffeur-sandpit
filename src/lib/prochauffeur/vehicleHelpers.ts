import type {
  Vehicle,
  VehicleCarFeatureRow,
  VehicleSpecificationChip,
  VehicleType,
} from "./types";
import { VEHICLE_TYPE_LABELS } from "./types";

const STRUCTURED_DEFAULTS = {
  wifi: "Complimentary",
  serviceClass: "Business",
};

function seatingLabel(passengerCount: number): string {
  return `${Math.max(1, passengerCount)} passengers`;
}

function luggageSpecificationLabel(small: number, large: number): string {
  const parts: string[] = [];
  if (small > 0) parts.push(`${small} small`);
  if (large > 0) parts.push(`${large} large`);
  if (parts.length === 0) return "2 large bags";
  return `${parts.join(", ")} bags`;
}

function displayOrDash(value: string): string {
  const trimmed = value.trim();
  return trimmed || "—";
}

export function vehicleDisplayName(vehicle: Vehicle): string {
  return `${vehicle.color} ${vehicle.make} ${vehicle.model}`.trim();
}

export function effectiveChauffeurUserId(vehicle: Vehicle): string | null {
  if (vehicle.assignedChauffeurUserId === "") return null;
  if (
    vehicle.assignedChauffeurUserId == null ||
    vehicle.assignedChauffeurUserId === undefined
  ) {
    return vehicle.driverID;
  }
  return vehicle.assignedChauffeurUserId;
}

export function synchronizedSpecificationChips(
  vehicle: Vehicle,
  stored: VehicleSpecificationChip[] = []
): VehicleSpecificationChip[] {
  const seating = seatingLabel(vehicle.passengerCapacity);
  const luggage = luggageSpecificationLabel(
    vehicle.fleetSmallLuggageCount,
    vehicle.fleetLargeLuggageCount
  );
  const wifi = vehicle.wifiServiceDescription.trim();
  const serviceClass = vehicle.serviceClassDescription.trim();
  const pairs: [string, string, string, string][] = [
    ["person.2.fill", "Seating", seating, "chip-seating"],
    ["suitcase.fill", "Luggage", luggage, "chip-luggage"],
    [
      "wifi",
      "Wifi",
      wifi || STRUCTURED_DEFAULTS.wifi,
      "chip-wifi",
    ],
    [
      "leaf.fill",
      "Class",
      serviceClass || STRUCTURED_DEFAULTS.serviceClass,
      "chip-class",
    ],
  ];
  return pairs.map((item, index) => ({
    id: stored[index]?.id ?? item[3],
    systemImageName: item[0],
    title: item[1],
    value: item[2],
  }));
}

export function synchronizedCarFeatureRows(
  vehicle: Vehicle,
  stored: VehicleCarFeatureRow[] = []
): VehicleCarFeatureRow[] {
  const rows: [string, string, string][] = [
    ["feat-model", "Model", `${vehicle.make} ${vehicle.model}`.trim()],
    [
      "feat-body",
      "Body",
      VEHICLE_TYPE_LABELS[vehicle.pricingVehicleType],
    ],
    [
      "feat-capacity",
      "Capacity",
      `${vehicle.passengerCapacity} passengers`,
    ],
    ["feat-interior", "Interior", displayOrDash(vehicle.interiorDescription)],
    [
      "feat-climate",
      "Climate",
      displayOrDash(vehicle.climateControlDescription),
    ],
    ["feat-gear", "Gear", displayOrDash(vehicle.gearTypeDescription)],
  ];
  return rows.map((item, index) => ({
    id: stored[index]?.id ?? item[0],
    label: item[1],
    value: item[2],
  }));
}

export function prepareVehicleForSave(vehicle: Vehicle): Vehicle {
  const luggage = luggageSpecificationLabel(
    vehicle.fleetSmallLuggageCount,
    vehicle.fleetLargeLuggageCount
  );
  return {
    ...vehicle,
    luggageDescription: luggage,
    specificationChips: synchronizedSpecificationChips(
      vehicle,
      vehicle.specificationChips
    ),
    carFeatureRows: synchronizedCarFeatureRows(
      vehicle,
      vehicle.carFeatureRows
    ),
  };
}

export function createEmptyVehicle(documentId: string): Vehicle {
  return {
    driverID: documentId,
    assignedChauffeurUserId: "",
    make: "",
    model: "",
    color: "",
    licensePlate: "",
    passengerCapacity: 4,
    manufactureYear: null,
    registrationJurisdictionCode: null,
    registrationExpiry: null,
    pricingVehicleType: "sedan" as VehicleType,
    specificationChips: [],
    carFeatureRows: [],
    luggageDescription: "",
    fleetSmallLuggageCount: 0,
    fleetLargeLuggageCount: 2,
    wifiServiceDescription: STRUCTURED_DEFAULTS.wifi,
    serviceClassDescription: STRUCTURED_DEFAULTS.serviceClass,
    interiorDescription: "",
    climateControlDescription: "",
    gearTypeDescription: "",
  };
}
