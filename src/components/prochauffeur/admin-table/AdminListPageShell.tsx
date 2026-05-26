"use client";

import Button from "@/components/ui/button/Button";
import type { AdminTableTab } from "@/hooks/useAdminDataTable";
import React from "react";

type AdminListPageShellProps = {
  title: string;
  subtitle: string;
  tabs: AdminTableTab[];
  activeTabId: string;
  tabCounts: Record<string, number>;
  onTabChange: (tabId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onExport?: () => void;
  primaryAction?: React.ReactNode;
  children: React.ReactNode;
};

function SearchIcon() {
  return (
    <svg
      className="size-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 17.5L13.875 13.875"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3.33325 5.83333H9.16659M9.16659 5.83333C9.16659 7.67428 7.67421 9.16667 5.83325 9.16667C3.9923 9.16667 2.49992 7.67428 2.49992 5.83333C2.49992 3.99238 3.9923 2.5 5.83325 2.5C7.67421 2.5 9.16659 3.99238 9.16659 5.83333ZM10.8333 14.1667H16.6666M10.8333 14.1667C10.8333 16.0076 12.3257 17.5 14.1666 17.5C16.0076 17.5 17.5 16.0076 17.5 14.1667C17.5 12.3257 16.0076 10.8333 14.1666 10.8333C12.3257 10.8333 10.8333 12.3257 10.8333 14.1667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5V11.6667M10 11.6667L6.66667 8.33333M10 11.6667L13.3333 8.33333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33325 12.5V14.1667C3.33325 15.0871 4.0796 15.8333 4.99992 15.8333H15C15.9203 15.8333 16.6666 15.0871 16.6666 14.1667V12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminListPageShell({
  title,
  subtitle,
  tabs,
  activeTabId,
  tabCounts,
  onTabChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search…",
  onFilter,
  onExport,
  primaryAction,
  children,
}: AdminListPageShellProps) {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        {primaryAction ? <div className="shrink-0">{primaryAction}</div> : null}
      </div>

      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-white/[0.03]">
          {tabs.map((tab) => {
            const active = tab.id === activeTabId;
            const count = tabCounts[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-white text-gray-800 shadow-theme-xs dark:bg-gray-800 dark:text-white/90"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/80"
                }`}
              >
                {tab.label}
                {count != null ? (
                  <span className="ml-1.5 text-gray-400 dark:text-gray-500">
                    ({count})
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[12rem] flex-1 sm:min-w-[14rem]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-gray-500 dark:focus:border-brand-800"
            />
          </div>
          {onFilter ? (
            <Button size="sm" variant="outline" startIcon={<SlidersIcon />} onClick={onFilter}>
              Filter
            </Button>
          ) : null}
          {onExport ? (
            <Button size="sm" variant="outline" startIcon={<ExportIcon />} onClick={onExport}>
              Export
            </Button>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}
