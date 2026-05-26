"use client";

import BookingCard from "@/components/prochauffeur/BookingCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import React from "react";

export default function BookingsList() {
  const vm = useAdminDashboard();

  return (
    <div>
      <PageBreadcrumb pageTitle="Bookings" />

      {vm.bookingActionError ? (
        <div className="mb-4 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-500">
          {vm.bookingActionError}
          <button
            type="button"
            className="ml-3 underline"
            onClick={vm.clearBookingActionError}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {!vm.hasReceivedTripsSnapshot ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading bookings…
        </p>
      ) : vm.upcomingTrips.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            No upcoming bookings
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            New trip requests will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {vm.upcomingTrips.map((trip) => (
            <BookingCard
              key={trip.id}
              trip={trip}
              chauffeurHeadline={vm.chauffeurName(trip.driverID)}
              customerCaption={`Customer: ${vm.customerName(trip)}`}
              isMutating={vm.bookingMutationTripID === trip.id}
              onConfirm={() => vm.confirmTripBooking(trip.id)}
              onDecline={() => vm.declineTripBooking(trip.id)}
              onCancel={() => vm.cancelActiveTrip(trip.id)}
              onComplete={() => vm.completeTripBooking(trip.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
