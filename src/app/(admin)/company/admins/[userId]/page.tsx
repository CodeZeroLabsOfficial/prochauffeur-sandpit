import CompanySectionRedirect from "@/components/prochauffeur/CompanySectionRedirect";

export default function AdminAccountPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <CompanySectionRedirect
      sectionId="administrators"
      search={`?admin=${encodeURIComponent(params.userId)}`}
    />
  );
}
