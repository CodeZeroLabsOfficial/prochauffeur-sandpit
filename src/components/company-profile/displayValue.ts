export function displayValue(value: string, fallback = "—"): string {
  const trimmed = value.trim();
  return trimmed || fallback;
}
