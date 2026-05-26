import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverAccreditation");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverAccreditationPage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverAccreditation" routeParams={{ userId }} />
  );
}
