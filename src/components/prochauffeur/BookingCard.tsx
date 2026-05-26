"use client";

import TripStatusBadge from "@/components/prochauffeur/TripStatusBadge";
import Button from "@/components/ui/button/Button";
import { bookingCardDatePipeTime, vehicleSubtitle } from "@/lib/prochauffeur/display";
import type { Trip } from "@/lib/prochauffeur/types";
import Link from "next/link";
import React from "react";

type BookingCardProps = {
  trip: Trip;
  chauffeurHeadline: string;
  customerCaption: string;
  isMutating?: boolean;
  showActions?: boolean;
  onConfirm?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
};

export default function BookingCard({
  trip,
  chauffeurHeadline,
  customerCaption,
  isMutating = false,
  showActions = true,
  onConfirm,
  onDecline,
  onCancel,
  onComplete,
}: BookingCardProps) {
  const isRequested = trip.status === "requested";
  const isActive = ["accepted", "en_route_pickup", "in_progress"].includes(
    trip.status
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <TripStatusBadge status={trip.status} />
            <Link
              href={`/bookings/${trip.id}`}
              className="text-sm font-semibold text-brand-500 hover:text-brand-600"
            >
              View details
            </Link>
          </div>
          <h4 className="font-semibold text-gray-800 dark:text-white/90">
            {chauffeurHeadline}
          </h4>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {bookingCardDatePipeTime(trip.createdAt)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {customerCaption}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {vehicleSubtitle(trip)}
          </p>
          {trip.pickupAddressLine ? (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {trip.pickupAddressLine}
              {trip.dropoffAddressLine ? ` → ${trip.dropoffAddressLine}` : ""}
            </p>
          ) : null}
        </div>
      </div>

      {showActions ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {isRequested ? (
            <>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={isMutating}
              >
                Confirm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onDecline}
                disabled={isMutating}
              >
                Decline
              </Button>
            </>
          ) : null}
          {isActive ? (
            <>
              <Button
                size="sm"
                onClick={onComplete}
                disabled={isMutating}
              >
                Complete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                disabled={isMutating}
              >
                Cancel
              </Button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
