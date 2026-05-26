"use client";

import BookingCard from "@/components/prochauffeur/BookingCard";
import TripStatusBadge from "@/components/prochauffeur/TripStatusBadge";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { listenTrip } from "@/lib/prochauffeur/firestore";
import {
  bookingCardDatePipeTime,
  formatSummaryDateTime,
  vehicleSubtitle,
} from "@/lib/prochauffeur/display";
import type { Trip } from "@/lib/prochauffeur/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function TripDetailView({ tripId }: { tripId: string }) {
  const vm = useAdminDashboard();
  const [trip, setTrip] = useState<Trip | null>(
    () => vm.trips.find((t) => t.id === tripId) ?? null
  );

  useEffect(() => {
    const fromContext = vm.trips.find((t) => t.id === tripId);
    if (fromContext) setTrip(fromContext);
  }, [tripId, vm.trips]);

  useEffect(() => {
    return listenTrip(tripId, setTrip);
  }, [tripId]);

  if (!trip) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Trip detail" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading trip…
        </p>
      </div>
    );
  }

  const timeline: { label: string; at?: Date }[] = [
    { label: "Requested", at: trip.createdAt },
    { label: "Last updated", at: trip.updatedAt },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Trip detail" />

      <div className="mb-4">
        <Link
          href="/bookings"
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← Back to bookings
        </Link>
      </div>

      {vm.bookingActionError ? (
        <div className="mb-4 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-500">
          {vm.bookingActionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <BookingCard
            trip={trip}
            chauffeurHeadline={vm.chauffeurName(trip.driverID)}
            customerCaption={`Customer: ${vm.customerName(trip)}`}
            isMutating={vm.bookingMutationTripID === trip.id}
            onConfirm={() => vm.confirmTripBooking(trip.id)}
            onDecline={() => vm.declineTripBooking(trip.id)}
            onCancel={() => vm.cancelActiveTrip(trip.id)}
            onComplete={() => vm.completeTripBooking(trip.id)}
            showActions
          />

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Journey
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Pickup</dt>
                <dd className="text-gray-800 dark:text-white/90">
                  {trip.pickupAddressLine ??
                    `${trip.pickup.latitude.toFixed(5)}, ${trip.pickup.longitude.toFixed(5)}`}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">Drop-off</dt>
                <dd className="text-gray-800 dark:text-white/90">
                  {trip.dropoffAddressLine ??
                    `${trip.dropoff.latitude.toFixed(5)}, ${trip.dropoff.longitude.toFixed(5)}`}
                </dd>
              </div>
              {trip.scheduledPickupAt ? (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">
                    Scheduled pickup
                  </dt>
                  <dd className="text-gray-800 dark:text-white/90">
                    {formatSummaryDateTime(trip.scheduledPickupAt)}
                  </dd>
                </div>
              ) : null}
              {trip.notes ? (
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Notes</dt>
                  <dd className="text-gray-800 dark:text-white/90">{trip.notes}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Status
            </h3>
            <TripStatusBadge status={trip.status} />
            <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {timeline.map((item) => (
                <li key={item.label}>
                  <span className="font-medium">{item.label}:</span>{" "}
                  {item.at ? formatSummaryDateTime(item.at) : "—"}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Customer
            </h3>
            <p className="text-sm text-gray-800 dark:text-white/90">
              {vm.customerName(trip)}
            </p>
            {trip.customerEmail ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {trip.customerEmail}
              </p>
            ) : null}
            {trip.customerPhoneNumber ? (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {trip.customerPhoneNumber}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
              Vehicle
            </h3>
            <p className="text-sm text-gray-800 dark:text-white/90">
              {vehicleSubtitle(trip)}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Booked {bookingCardDatePipeTime(trip.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
