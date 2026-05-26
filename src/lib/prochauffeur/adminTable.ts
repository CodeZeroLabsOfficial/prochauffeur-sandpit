export type SortDirection = "asc" | "desc";

export function compareValues(
  a: string | number,
  b: string | number,
  direction: SortDirection
): number {
  const factor = direction === "asc" ? 1 : -1;
  if (typeof a === "number" && typeof b === "number") {
    return (a - b) * factor;
  }
  return String(a).localeCompare(String(b), undefined, {
    sensitivity: "base",
    numeric: true,
  }) * factor;
}

export function matchesSearch(
  query: string,
  ...values: (string | null | undefined)[]
): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return values.some((v) => (v ?? "").toLowerCase().includes(needle));
}

export function downloadCsv(filename: string, headers: string[], rows: string[][]): void {
  const escape = (cell: string) => {
    const value = cell.replace(/"/g, '""');
    return /[",\n]/.test(value) ? `"${value}"` : value;
  };
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map(escape).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
