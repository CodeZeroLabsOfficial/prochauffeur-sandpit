"use client";

import DriverSwitcher from "@/components/prochauffeur/DriverSwitcher";
import {
  driverNavSections,
  isDriverNavActive,
} from "@/lib/prochauffeur/driverNav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type DriverSettingsSidebarProps = {
  userId: string;
  onNavigate?: () => void;
  className?: string;
};

export default function DriverSettingsSidebar({
  userId,
  onNavigate,
  className = "",
}: DriverSettingsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex w-full shrink-0 flex-col border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:w-[320px] lg:border-r ${className}`}
    >
      <div className="border-b border-gray-200 px-5 py-5 dark:border-gray-800">
        <DriverSwitcher userId={userId} onNavigate={onNavigate} />
      </div>

      <nav className="flex-1 overflow-y-auto px-5 pt-6 pb-6">
        <div className="space-y-6">
          {driverNavSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const active = isDriverNavActive(
                    pathname,
                    userId,
                    item.segment
                  );
                  return (
                    <li key={item.segment || "overview"}>
                      <Link
                        href={item.href(userId)}
                        onClick={onNavigate}
                        className={`menu-item ${
                          active ? "menu-item-active" : "menu-item-inactive"
                        }`}
                      >
                        <span
                          className={
                            active
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          }
                        >
                          {item.icon}
                        </span>
                        <span className="menu-item-text">{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}
