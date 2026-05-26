import type { ReactNode } from "react";
import {
  CalenderIcon,
  DollarLineIcon,
  GroupIcon,
  LockIcon,
  PageIcon,
  PlugInIcon,
  TimeIcon,
  UserIcon,
} from "@/icons/index";

export type SettingsNavItem = {
  name: string;
  sectionId: string;
  href: string;
  icon: ReactNode;
};

export type SettingsNavSection = {
  title: string;
  items: SettingsNavItem[];
};

export const defaultSettingsSectionId = "license";

export const settingsNavSections: SettingsNavSection[] = [
  {
    title: "Settings",
    items: [
      {
        name: "License",
        sectionId: "license",
        href: "/settings#license",
        icon: <LockIcon />,
      },
      {
        name: "Administrators",
        sectionId: "administrators",
        href: "/settings#administrators",
        icon: <GroupIcon />,
      },
      {
        name: "Integrations",
        sectionId: "integrations",
        href: "/settings#integrations",
        icon: <PlugInIcon />,
      },
    ],
  },
  {
    title: "Locale",
    items: [
      {
        name: "Language",
        sectionId: "language",
        href: "/settings#language",
        icon: <PageIcon />,
      },
      {
        name: "Country",
        sectionId: "country",
        href: "/settings#country",
        icon: <UserIcon />,
      },
      {
        name: "Date format",
        sectionId: "date-format",
        href: "/settings#date-format",
        icon: <CalenderIcon />,
      },
      {
        name: "Time format",
        sectionId: "time-format",
        href: "/settings#time-format",
        icon: <TimeIcon />,
      },
      {
        name: "Timezone",
        sectionId: "timezone",
        href: "/settings#timezone",
        icon: <TimeIcon />,
      },
      {
        name: "Number format",
        sectionId: "number-format",
        href: "/settings#number-format",
        icon: <DollarLineIcon />,
      },
    ],
  },
];

export const settingsNavItems = settingsNavSections.flatMap(
  (section) => section.items
);

export function isSettingsSectionPath(pathname: string): boolean {
  return pathname === "/settings" || pathname.startsWith("/settings/");
}

export function isSettingsNavActive(sectionId: string, hash: string): boolean {
  const current = hash.replace(/^#/, "") || defaultSettingsSectionId;
  return current === sectionId;
}

export function settingsHref(sectionId: string, search = ""): string {
  return `/settings${search}#${sectionId}`;
}
