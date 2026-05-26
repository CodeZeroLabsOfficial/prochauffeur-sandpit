import CompanySettingsView from "@/components/prochauffeur/CompanySettingsView";
import { Suspense } from "react";

export const metadata = {
  title: "Company | ProChauffeur Dispatch",
};

export default function CompanyPage() {
  return (
    <Suspense fallback={null}>
      <CompanySettingsView />
    </Suspense>
  );
}
