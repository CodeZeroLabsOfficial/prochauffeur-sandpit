import type {
  PricingAddon,
  PricingConfig,
  PricingVehicleTier,
  VehicleType,
} from "./types";
import {
  ALL_VEHICLE_TYPES,
  DEFAULT_PRICING_CONFIG,
  VEHICLE_TYPE_LABELS,
} from "./types";

function coerceNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeVehicleType(value: unknown): VehicleType | null {
  if (typeof value !== "string") return null;
  return ALL_VEHICLE_TYPES.includes(value as VehicleType)
    ? (value as VehicleType)
    : null;
}

export function mergePricingVehicleTiers(
  tiers: PricingVehicleTier[]
): PricingVehicleTier[] {
  return ALL_VEHICLE_TYPES.map((type) => {
    const existing = tiers.find((tier) => tier.type === type);
    const fallback =
      DEFAULT_PRICING_CONFIG.vehicles.find((tier) => tier.type === type)!;
    return existing ?? fallback;
  });
}

export function parsePricingConfig(data: Record<string, unknown>): PricingConfig {
  const vehicles = Array.isArray(data.vehicles)
    ? data.vehicles
        .map((row): PricingVehicleTier | null => {
          if (!row || typeof row !== "object") return null;
          const v = row as Record<string, unknown>;
          const type = normalizeVehicleType(v.type);
          if (!type) return null;
          return {
            type,
            multiplier: coerceNumber(v.multiplier, 1),
            minimumBookedHours: Math.max(
              1,
              Math.trunc(coerceNumber(v.minimumBookedHours, 2))
            ),
            displayHourlyFrom:
              v.displayHourlyFrom != null
                ? coerceNumber(v.displayHourlyFrom, 0)
                : null,
          };
        })
        .filter((tier): tier is PricingVehicleTier => tier != null)
    : [];

  const addons = Array.isArray(data.addons)
    ? data.addons
        .map((row): PricingAddon | null => {
          if (!row || typeof row !== "object") return null;
          const v = row as Record<string, unknown>;
          const id = String(v.id ?? "").trim();
          const title = String(v.title ?? "").trim();
          if (!id || !title) return null;
          return {
            id,
            title,
            price: coerceNumber(v.price, 0),
          };
        })
        .filter((addon): addon is PricingAddon => addon != null)
    : DEFAULT_PRICING_CONFIG.addons;

  return {
    minimumFare: coerceNumber(
      data.minimumFare,
      DEFAULT_PRICING_CONFIG.minimumFare
    ),
    baseFare: coerceNumber(data.baseFare, DEFAULT_PRICING_CONFIG.baseFare),
    distanceRatePerKm: coerceNumber(
      data.distanceRatePerKm,
      DEFAULT_PRICING_CONFIG.distanceRatePerKm
    ),
    timeRatePerHour: coerceNumber(
      data.timeRatePerHour,
      DEFAULT_PRICING_CONFIG.timeRatePerHour
    ),
    waitingFeeFlat: coerceNumber(
      data.waitingFeeFlat,
      DEFAULT_PRICING_CONFIG.waitingFeeFlat
    ),
    peakOrWeekendMultiplier: coerceNumber(
      data.peakOrWeekendMultiplier,
      DEFAULT_PRICING_CONFIG.peakOrWeekendMultiplier
    ),
    returnToBaseFee: coerceNumber(
      data.returnToBaseFee,
      DEFAULT_PRICING_CONFIG.returnToBaseFee
    ),
    vehicles: mergePricingVehicleTiers(vehicles),
    addons: addons.length > 0 ? addons : DEFAULT_PRICING_CONFIG.addons,
  };
}

export function encodePricingConfig(config: PricingConfig): Record<string, unknown> {
  return {
    minimumFare: config.minimumFare,
    baseFare: config.baseFare,
    distanceRatePerKm: config.distanceRatePerKm,
    timeRatePerHour: config.timeRatePerHour,
    waitingFeeFlat: config.waitingFeeFlat,
    peakOrWeekendMultiplier: config.peakOrWeekendMultiplier,
    returnToBaseFee: config.returnToBaseFee,
    vehicles: config.vehicles.map((tier) => ({
      type: tier.type,
      multiplier: tier.multiplier,
      minimumBookedHours: tier.minimumBookedHours,
      displayHourlyFrom: tier.displayHourlyFrom,
    })),
    addons: config.addons.map((addon) => ({
      id: addon.id,
      title: addon.title,
      price: addon.price,
    })),
  };
}

export function vehicleTierLabel(type: VehicleType): string {
  return VEHICLE_TYPE_LABELS[type];
}
