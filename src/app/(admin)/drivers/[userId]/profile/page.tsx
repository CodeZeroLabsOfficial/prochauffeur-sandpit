import DriverProfileEditView from "@/components/prochauffeur/DriverProfileEditView";

export const metadata = {
  title: "Edit driver profile | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverProfilePage({ params }: Props) {
  const { userId } = await params;
  return <DriverProfileEditView userId={userId} />;
}
