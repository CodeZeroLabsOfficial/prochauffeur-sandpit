"use client";

import SettingsEditableCard from "@/components/company-profile/SettingsEditableCard";
import { displayValue } from "@/components/company-profile/displayValue";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { vehicleDisplayName } from "@/lib/prochauffeur/vehicleHelpers";
import { VEHICLE_TYPE_LABELS } from "@/lib/prochauffeur/types";
import { useRouter } from "next/navigation";
import React from "react";

type DriverFleetCardProps = {
  userId: string;
};

export default function DriverFleetCard({ userId }: DriverFleetCardProps) {
  const router = useRouter();
  const { vehicleForChauffeur } = useAdminOperations();
  const vehicle = vehicleForChauffeur(userId);

  return (
    <SettingsEditableCard
      onEdit={() => router.push(`/drivers/${userId}/vehicle`)}
      editAriaLabel="Edit vehicle assignment"
    >
      <h4 className="pe-10 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        Fleet assignment
      </h4>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Vehicle
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {vehicle ? vehicleDisplayName(vehicle) : "—"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            License plate
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {vehicle ? displayValue(vehicle.licensePlate) : "—"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Vehicle type
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {vehicle
              ? VEHICLE_TYPE_LABELS[vehicle.pricingVehicleType]
              : "—"}
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
            Passenger capacity
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {vehicle ? String(vehicle.passengerCapacity) : "—"}
          </p>
        </div>
      </div>
    </SettingsEditableCard>
  );
}
