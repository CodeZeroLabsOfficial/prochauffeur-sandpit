import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverAvailability");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverAvailabilityPage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverAvailability" routeParams={{ userId }} />
  );
}
