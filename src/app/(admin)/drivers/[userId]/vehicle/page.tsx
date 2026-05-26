import DriverVehicleAssignmentView from "@/components/prochauffeur/DriverVehicleAssignmentView";

export const metadata = {
  title: "Vehicle assignment | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverVehiclePage({ params }: Props) {
  const { userId } = await params;
  return <DriverVehicleAssignmentView userId={userId} />;
}
