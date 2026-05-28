"use client";

import TripStatusBadge from "@/components/prochauffeur/TripStatusBadge";
import { ChevronRightIcon } from "@/icons";
import { bookingCardDatePipeTime } from "@/lib/prochauffeur/display";
import type { Trip } from "@/lib/prochauffeur/types";
import Link from "next/link";
import React from "react";

type UpcomingTripPreviewCardProps = {
  trip: Trip;
  name: string;
  customerName: string;
};

export default function UpcomingTripPreviewCard({
  trip,
  name,
  customerName,
}: UpcomingTripPreviewCardProps) {
  return (
    <Link
      href={`/bookings/${trip.id}`}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-300 dark:border-gray-800 dark:bg-transparent dark:hover:border-gray-700"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className="truncate font-semibold text-gray-800 dark:text-white/90">
            {name}
          </h4>
          <TripStatusBadge status={trip.status} />
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {bookingCardDatePipeTime(trip.createdAt)}
        </p>
        <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
          {customerName}
        </p>
      </div>
      <ChevronRightIcon
        className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
        aria-hidden
      />
    </Link>
  );
}
