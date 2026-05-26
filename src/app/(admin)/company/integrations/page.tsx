import CompanyPlaceholderView from "@/components/prochauffeur/CompanyPlaceholderView";

export const metadata = {
  title: "Integrations | ProChauffeur Dispatch",
};

export default function CompanyIntegrationsPage() {
  return (
    <CompanyPlaceholderView
      title="Integrations"
      message="Connect calendars, payments, telematics, and partner APIs. Chauffeur operations rarely run on a single system — this hub will host those links when ready."
    />
  );
}
