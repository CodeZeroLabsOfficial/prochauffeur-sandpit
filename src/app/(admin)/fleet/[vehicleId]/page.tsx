import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("fleetEdit");

type Props = {
  params: Promise<{ vehicleId: string }>;
};

export default async function FleetVehiclePage({ params }: Props) {
  const { vehicleId } = await params;
  return (
    <DynamicStubPage stubKey="fleetEdit" routeParams={{ vehicleId }} />
  );
}
