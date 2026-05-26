"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type CompanySectionRedirectProps = {
  sectionId: string;
  search?: string;
};

export default function CompanySectionRedirect({
  sectionId,
  search = "",
}: CompanySectionRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/company${search}#${sectionId}`);
  }, [router, search, sectionId]);

  return null;
}
