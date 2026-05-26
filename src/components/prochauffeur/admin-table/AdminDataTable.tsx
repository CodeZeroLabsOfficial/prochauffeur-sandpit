"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Pagination from "@/components/tables/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SortDirection } from "@/lib/prochauffeur/adminTable";
import React from "react";

export type AdminTableColumn<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => React.ReactNode;
};

type AdminDataTableProps<T> = {
  columns: AdminTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  sortKey: string;
  sortDirection: SortDirection;
  onSort: (key: string) => void;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAllOnPage: () => void;
  allOnPageSelected: boolean;
  renderRowActions?: (row: T) => React.ReactNode;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  emptyTitle: string;
  emptyDescription: string;
  loading?: boolean;
  loadingMessage?: string;
};

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <span className="ml-1 inline-flex flex-col text-gray-400">
      <svg
        className={`-mb-0.5 size-2.5 ${active && direction === "asc" ? "text-brand-500" : ""}`}
        viewBox="0 0 8 5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 0L7.4641 5H0.535898L4 0Z" />
      </svg>
      <svg
        className={`size-2.5 ${active && direction === "desc" ? "text-brand-500" : ""}`}
        viewBox="0 0 8 5"
        fill="currentColor"
        aria-hidden
      >
        <path d="M4 5L0.535898 0H7.4641L4 5Z" />
      </svg>
    </span>
  );
}

function TableCheckbox({
  checked,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <Checkbox
      checked={checked}
      onChange={onChange}
      className="shrink-0"
      id={ariaLabel}
    />
  );
}

export default function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  sortKey,
  sortDirection,
  onSort,
  selectedIds,
  onToggleRow,
  onToggleAllOnPage,
  allOnPageSelected,
  renderRowActions,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  emptyTitle,
  emptyDescription,
  loading = false,
  loadingMessage = "Loading…",
}: AdminDataTableProps<T>) {
  const alignClass = (align?: "left" | "right" | "center") => {
    if (align === "right") return "text-right";
    if (align === "center") return "text-center";
    return "text-left";
  };

  return (
    <>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="px-5 py-12 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
            {loadingMessage}
          </p>
        ) : rows.length === 0 ? (
          <div className="px-5 py-16 text-center sm:px-6">
            <h3 className="font-semibold text-gray-800 dark:text-white/90">
              {emptyTitle}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {emptyDescription}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="w-12 px-5 py-4 text-start sm:px-6"
                >
                  <TableCheckbox
                    checked={allOnPageSelected}
                    onChange={() => onToggleAllOnPage()}
                    ariaLabel="select-all-rows"
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    isHeader
                    className={`px-4 py-3.5 text-sm font-medium text-gray-500 dark:text-gray-400 ${alignClass(col.align)} ${col.headerClassName ?? ""}`}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        className={`inline-flex items-center gap-0.5 hover:text-gray-800 dark:hover:text-white/90 ${alignClass(col.align)}`}
                        onClick={() => onSort(col.key)}
                      >
                        {col.header}
                        <SortIcon
                          active={sortKey === col.key}
                          direction={sortDirection}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </TableCell>
                ))}
                {renderRowActions ? (
                  <TableCell
                    isHeader
                    className="w-14 px-4 py-3.5 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    <span className="sr-only">Actions</span>
                  </TableCell>
                ) : null}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {rows.map((row) => {
                const id = rowKey(row);
                return (
                  <TableRow
                    key={id}
                    className="transition hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
                  >
                    <TableCell className="w-12 px-5 py-4 sm:px-6">
                      <TableCheckbox
                        checked={selectedIds.has(id)}
                        onChange={() => onToggleRow(id)}
                        ariaLabel={`select-row-${id}`}
                      />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={`px-4 py-4 text-theme-sm ${alignClass(col.align)} ${col.cellClassName ?? ""}`}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                    {renderRowActions ? (
                      <TableCell className="px-4 py-4 text-right">
                        {renderRowActions(row)}
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {!loading && totalCount > 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-4 dark:border-white/[0.05] sm:px-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {rows.length} of {totalCount}
          </p>
          {totalPages > 1 ? (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}
