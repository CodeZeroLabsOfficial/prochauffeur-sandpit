import AdminAccountView from "@/components/prochauffeur/AdminAccountView";

export const metadata = {
  title: "Administrator | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function CompanyAdminDetailPage({ params }: Props) {
  const { userId } = await params;
  return <AdminAccountView userId={userId} />;
}
