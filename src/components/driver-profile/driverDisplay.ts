import { displayValue } from "@/components/company-profile/displayValue";

export { displayValue };

export function displayOptionalDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function displayYesNo(value: boolean): string {
  return value ? "Yes" : "No";
}

const AVATAR_COLORS = [
  "bg-brand-500",
  "bg-orange-500",
  "bg-success-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-600",
] as const;

export function driverAvatarColorClass(id: string): (typeof AVATAR_COLORS)[number] {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function driverInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}
