import CompanySectionRedirect from "@/components/prochauffeur/CompanySectionRedirect";

export default function CompanyLocationEditPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <CompanySectionRedirect
      sectionId="locations"
      search={`?editLocation=${encodeURIComponent(params.id)}`}
    />
  );
}
