import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverProfile");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverProfilePage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverProfile" routeParams={{ userId }} />
  );
}
