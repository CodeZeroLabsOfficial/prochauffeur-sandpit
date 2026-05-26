import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverHub");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverHubPage({ params }: Props) {
  const { userId } = await params;
  return <DynamicStubPage stubKey="driverHub" routeParams={{ userId }} />;
}
