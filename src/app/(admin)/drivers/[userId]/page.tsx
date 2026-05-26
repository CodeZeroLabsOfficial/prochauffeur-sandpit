import DriverHubView from "@/components/prochauffeur/DriverHubView";

export const metadata = {
  title: "Driver | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverHubPage({ params }: Props) {
  const { userId } = await params;
  return <DriverHubView userId={userId} />;
}
