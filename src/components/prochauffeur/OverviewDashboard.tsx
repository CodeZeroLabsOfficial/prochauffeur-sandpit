"use client";

import BookingCard from "@/components/prochauffeur/BookingCard";
import MetricCard from "@/components/prochauffeur/MetricCard";
import TripVolumeChart from "@/components/prochauffeur/TripVolumeChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { GroupIcon } from "@/icons";
import Link from "next/link";
import React from "react";

export default function OverviewDashboard() {
  const vm = useAdminDashboard();

  return (
    <div>
      <PageBreadcrumb pageTitle="Overview" />

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
        <div className="col-span-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] sm:col-span-2">
              <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800">
                <div className="px-6 py-8 text-center">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white/90">
                    {vm.tripsBookedToday}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Trips booked today
                  </p>
                </div>
                <div className="px-6 py-8 text-center">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white/90">
                    {vm.activeTripsInWindow}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Active now
                  </p>
                </div>
              </div>
            </div>
            <MetricCard
              title="Customers"
              value={vm.customerAccounts}
              icon={<GroupIcon className="size-6" />}
            />
            <MetricCard
              title="Chauffeurs"
              value={vm.chauffeurAccounts}
              icon={
                <svg
                  className="size-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-7 9a2 2 0 0 0-2 2v1.09c0 .55.22 1.07.62 1.45l1.38 1.32V20a1 1 0 0 0 1 1h2v-4.14l-2-1.9V13a4 4 0 1 1 8 0v1.96l-2 1.9V20h2a1 1 0 0 0 1-1v-3.14l1.38-1.32c.4-.38.62-.9.62-1.45V13a2 2 0 0 0-2-2H5Z" />
                </svg>
              }
            />
          </div>
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
              <div className="space-y-4">
                {vm.upcomingTripPreview.map((trip) => (
                  <BookingCard
                    key={trip.id}
                    trip={trip}
                    chauffeurHeadline={vm.chauffeurName(trip.driverID)}
                    customerCaption={`Customer: ${vm.customerName(trip)}`}
                    isMutating={vm.bookingMutationTripID === trip.id}
                    showActions={false}
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
