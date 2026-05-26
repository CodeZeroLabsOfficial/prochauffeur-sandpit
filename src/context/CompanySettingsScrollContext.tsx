"use client";

import {
  companyNavItems,
  defaultCompanySectionId,
} from "@/lib/prochauffeur/companyNav";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type CompanySettingsScrollContextValue = {
  activeSection: string;
  scrollToSection: (id: string) => void;
};

const CompanySettingsScrollContext =
  createContext<CompanySettingsScrollContextValue | null>(null);

function isValidSectionId(id: string): boolean {
  return companyNavItems.some((item) => item.sectionId === id);
}

export function CompanySettingsScrollProvider({
  children,
  scrollContainerRef,
}: {
  children: React.ReactNode;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [activeSection, setActiveSection] = useState(defaultCompanySectionId);

  const scrollToSection = useCallback(
    (id: string) => {
      const container = scrollContainerRef.current;
      const section = container?.querySelector<HTMLElement>(
        `#${CSS.escape(id)}`
      );
      if (!container || !section) return;

      const top =
        section.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop;

      container.scrollTo({ top, behavior: "smooth" });
      setActiveSection(id);
    },
    [scrollContainerRef]
  );

  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash.slice(1);
      if (hash && isValidSectionId(hash)) {
        requestAnimationFrame(() => scrollToSection(hash));
      } else if (!hash) {
        setActiveSection(defaultCompanySectionId);
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [scrollToSection]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const sectionElements = companyNavItems
      .map((item) =>
        container.querySelector<HTMLElement>(`#${CSS.escape(item.sectionId)}`)
      )
      .filter((element): element is HTMLElement => element != null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const nextActive = visible[0]?.target.id;
        if (!nextActive || !isValidSectionId(nextActive)) return;

        setActiveSection(nextActive);
        const nextHash = `#${nextActive}`;
        if (window.location.hash !== nextHash) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}${nextHash}`
          );
        }
      },
      {
        root: container,
        rootMargin: "-12% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [scrollContainerRef]);

  return (
    <CompanySettingsScrollContext.Provider
      value={{ activeSection, scrollToSection }}
    >
      {children}
    </CompanySettingsScrollContext.Provider>
  );
}

export function useCompanySettingsScroll() {
  const context = useContext(CompanySettingsScrollContext);
  if (!context) {
    throw new Error(
      "useCompanySettingsScroll must be used within CompanySettingsScrollProvider"
    );
  }
  return context;
}
