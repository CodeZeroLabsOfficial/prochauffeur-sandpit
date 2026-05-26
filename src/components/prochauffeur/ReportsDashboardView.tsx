"use client";

import MetricCard from "@/components/prochauffeur/MetricCard";
import TripVolumeChart from "@/components/prochauffeur/TripVolumeChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import {
  computeReportMetrics,
  estimateRevenueFloor,
  formatCurrency,
  statusBreakdown,
} from "@/lib/prochauffeur/reportsHelpers";
import { TRIP_STATUS_LABELS } from "@/lib/prochauffeur/types";
import type { TripVolumeChartPeriod } from "@/lib/prochauffeur/types";
import React, { useMemo, useState } from "react";

export default function ReportsDashboardView() {
  const vm = useAdminDashboard();
  const { pricingConfig, vehicles } = useAdminOperations();
  const [period, setPeriod] = useState<TripVolumeChartPeriod>("This Month");

  const metrics = useMemo(
    () => computeReportMetrics(vm.trips, period),
    [period, vm.trips]
  );

  const assignedDrivers = useMemo(() => {
    const chauffeurIds = vm.users
      .filter((user) => user.role === "driver")
      .map((user) => user.id);
    const assigned = new Set<string>();
    for (const vehicle of vehicles) {
      const linked =
        vehicle.assignedChauffeurUserId === ""
          ? null
          : vehicle.assignedChauffeurUserId ?? vehicle.driverID;
      if (linked && chauffeurIds.includes(linked)) {
        assigned.add(linked);
      }
    }
    return assigned.size;
  }, [vehicles, vm.users]);

  const revenueFloor = estimateRevenueFloor(
    metrics.completedTrips,
    pricingConfig.minimumFare
  );
  const breakdown = statusBreakdown(metrics.tripsInPeriod);
  const utilizationRate =
    vm.chauffeurAccounts > 0
      ? Math.round((assignedDrivers / vm.chauffeurAccounts) * 100)
      : 0;

  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fleet performance for the selected period.
        </p>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as TripVolumeChartPeriod)}
          className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          <option value="This Week">This week</option>
          <option value="This Month">This month</option>
          <option value="Last 3 Months">Last 3 months</option>
          <option value="This Year">This year</option>
        </select>
      </div>

      {!vm.hasReceivedTripsSnapshot ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading reports…
        </p>
      ) : (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Trips booked" value={metrics.totalTrips} icon={<StatIcon />} />
            <MetricCard
              title="Completed"
              value={metrics.completedTrips}
              icon={<StatIcon />}
            />
            <MetricCard
              title="Completion rate"
              value={`${metrics.completionRate}%`}
              icon={<StatIcon />}
            />
            <MetricCard
              title="Revenue floor"
              value={formatCurrency(revenueFloor)}
              icon={<StatIcon />}
            />
          </div>

          <div className="col-span-12 xl:col-span-7">
            <TripVolumeChart
              section={vm.tripVolumeSection}
              period={period}
              onPeriodChange={setPeriod}
            />
          </div>

          <div className="col-span-12 xl:col-span-5 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">
                Fleet utilization
              </h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Drivers with vehicles
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {assignedDrivers}/{vm.chauffeurAccounts}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Vehicle assignment rate
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {utilizationRate}%
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Active / upcoming in period
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {metrics.activeTrips}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500 dark:text-gray-400">
                    Cancelled in period
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-white/90">
                    {metrics.cancelledTrips}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
              <h3 className="font-semibold text-gray-800 dark:text-white/90">
                Status breakdown
              </h3>
              <div className="mt-4 space-y-2">
                {Object.entries(breakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500 dark:text-gray-400">
                      {TRIP_STATUS_LABELS[status as keyof typeof TRIP_STATUS_LABELS]}
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-warning-500/20 bg-warning-500/5 px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              Revenue floor uses minimum fare ({formatCurrency(pricingConfig.minimumFare)})
              × completed trips. Trips do not store final fares in Firestore yet, so
              this is an estimate only.
            </div>
          </div>
        </div>
      )}
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
