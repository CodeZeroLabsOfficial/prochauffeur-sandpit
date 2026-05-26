"use client";

import { compareValues, type SortDirection } from "@/lib/prochauffeur/adminTable";
import { useCallback, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export type AdminTableTab = {
  id: string;
  label: string;
};

type UseAdminDataTableOptions<T> = {
  rows: T[];
  rowKey: (row: T) => string;
  tabs: AdminTableTab[];
  defaultTabId?: string;
  pageSize?: number;
  filterByTab: (row: T, tabId: string) => boolean;
  filterBySearch: (row: T, query: string) => boolean;
  sortValue: (row: T, sortKey: string) => string | number;
  defaultSortKey: string;
  defaultSortDirection?: SortDirection;
};

export function useAdminDataTable<T>({
  rows,
  rowKey,
  tabs,
  defaultTabId,
  pageSize = DEFAULT_PAGE_SIZE,
  filterByTab,
  filterBySearch,
  sortValue,
  defaultSortKey,
  defaultSortDirection = "asc",
}: UseAdminDataTableOptions<T>) {
  const [activeTabId, setActiveTabId] = useState(
    defaultTabId ?? tabs[0]?.id ?? "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    defaultSortDirection
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    return rows.filter(
      (row) =>
        filterByTab(row, activeTabId) && filterBySearch(row, searchQuery)
    );
  }, [activeTabId, filterBySearch, filterByTab, rows, searchQuery]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) =>
      compareValues(
        sortValue(a, sortKey),
        sortValue(b, sortKey),
        sortDirection
      )
    );
  }, [filteredRows, sortDirection, sortKey, sortValue]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [pageSize, safeCurrentPage, sortedRows]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of tabs) {
      counts[tab.id] = rows.filter((row) => filterByTab(row, tab.id)).length;
    }
    return counts;
  }, [filterByTab, rows, tabs]);

  const toggleSort = useCallback(
    (key: string) => {
      setCurrentPage(1);
      if (sortKey === key) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
    },
    [sortKey]
  );

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllOnPage = useCallback(() => {
    const pageIds = paginatedRows.map(rowKey);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }, [paginatedRows, rowKey, selectedIds]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setActiveTabId(defaultTabId ?? tabs[0]?.id ?? "all");
    setCurrentPage(1);
  }, [defaultTabId, tabs]);

  const setTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    setCurrentPage(1);
    clearSelection();
  }, [clearSelection]);

  const setSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const allOnPageSelected =
    paginatedRows.length > 0 &&
    paginatedRows.every((row) => selectedIds.has(rowKey(row)));

  return {
    activeTabId,
    setTab,
    searchQuery,
    setSearch,
    sortKey,
    sortDirection,
    toggleSort,
    selectedIds,
    toggleRow,
    toggleAllOnPage,
    allOnPageSelected,
    clearSelection,
    resetFilters,
    filteredRows: sortedRows,
    paginatedRows,
    tabCounts,
    currentPage: safeCurrentPage,
    setCurrentPage,
    totalPages,
    pageSize,
    totalCount: sortedRows.length,
  };
}
