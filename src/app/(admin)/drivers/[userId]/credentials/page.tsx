import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverCredentials");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverCredentialsPage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverCredentials" routeParams={{ userId }} />
  );
}
