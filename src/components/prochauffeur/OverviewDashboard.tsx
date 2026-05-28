"use client";

import UpcomingTripPreviewCard from "@/components/prochauffeur/UpcomingTripPreviewCard";
import MetricCard from "@/components/prochauffeur/MetricCard";
import TripVolumeChart from "@/components/prochauffeur/TripVolumeChart";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import Link from "next/link";
import React from "react";

export default function OverviewDashboard() {
  const vm = useAdminDashboard();

  return (
    <div>

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

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Trips booked today"
            value={vm.tripsBookedToday}
            icon={<StatIcon />}
          />
          <MetricCard
            title="Active now"
            value={vm.activeTripsInWindow}
            icon={<StatIcon />}
          />
          <MetricCard
            title="Customers"
            value={vm.customerAccounts}
            icon={<StatIcon />}
          />
          <MetricCard
            title="Chauffeurs"
            value={vm.chauffeurAccounts}
            icon={<StatIcon />}
          />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <TripVolumeChart section={vm.tripVolumeSection} />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">
                Upcoming trips
              </h3>
              <Link
                href="/bookings"
                className="text-sm font-semibold text-brand-500 hover:text-brand-600"
              >
                See all
              </Link>
            </div>
            {!vm.hasReceivedTripsSnapshot ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading bookings…
              </p>
            ) : vm.upcomingTripPreview.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No live trips in the loaded window.
              </p>
            ) : (
              <div className="space-y-3">
                {vm.upcomingTripPreview.map((trip) => (
                  <UpcomingTripPreviewCard
                    key={trip.id}
                    trip={trip}
                    name={vm.chauffeurName(trip.driverID)}
                    customerName={vm.customerName(trip)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">
                Recent activity
              </h3>
              <Link
                href="/activity"
                className="text-sm font-semibold text-brand-500 hover:text-brand-600"
              >
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {vm.recentActivityItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
                >
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {item.headline}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.subline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatIcon() {
  return (
    <svg className="size-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 19h16v2H2V3h2v16Zm4-8h2v8H8v-8Zm4-4h2v12h-2V7Zm4 6h2v6h-2v-6Z" />
    </svg>
  );
}
