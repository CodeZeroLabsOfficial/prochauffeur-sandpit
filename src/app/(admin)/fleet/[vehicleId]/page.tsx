import FleetVehicleForm from "@/components/prochauffeur/FleetVehicleForm";

export const metadata = {
  title: "Edit vehicle | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ vehicleId: string }>;
};

export default async function FleetVehiclePage({ params }: Props) {
  const { vehicleId } = await params;
  return <FleetVehicleForm vehicleId={vehicleId} />;
}
