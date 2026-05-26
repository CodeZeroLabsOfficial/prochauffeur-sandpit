import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverVehicle");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverVehiclePage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverVehicle" routeParams={{ userId }} />
  );
}
