"use client";

import type { TripVolumeBarPoint, TripVolumeChartPeriod } from "@/lib/prochauffeur/types";
import { TRIP_VOLUME_PERIODS } from "@/lib/prochauffeur/tripVolume";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type TripVolumeChartProps = {
  section: (period: TripVolumeChartPeriod) => {
    bars: TripVolumeBarPoint[];
    total: number;
  };
};

export default function TripVolumeChart({ section }: TripVolumeChartProps) {
  const [period, setPeriod] = useState<TripVolumeChartPeriod>("This Week");
  const { bars, total } = section(period);

  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        height: 280,
      },
      colors: ["#465FFF"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "55%",
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: bars.map((b) => b.label),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          style: { colors: "#98A2B3" },
        },
      },
      grid: {
        borderColor: "#F2F4F7",
        strokeDashArray: 4,
      },
      tooltip: { theme: "dark" },
    }),
    [bars]
  );

  const series = useMemo(
    () => [{ name: "Trips", data: bars.map((b) => b.count) }],
    [bars]
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white/90">
            Trip volume
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {total} trips in selected period
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as TripVolumeChartPeriod)}
          className="rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300"
        >
          {TRIP_VOLUME_PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <ReactApexChart options={options} series={series} type="bar" height={280} />
    </div>
  );
}
