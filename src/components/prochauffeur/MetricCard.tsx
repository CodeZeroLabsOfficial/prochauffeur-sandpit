import React from "react";

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

export default function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white">
        {icon}
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}
