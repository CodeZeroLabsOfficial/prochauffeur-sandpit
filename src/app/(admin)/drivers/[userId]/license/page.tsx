import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverLicense");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverLicensePage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverLicense" routeParams={{ userId }} />
  );
}
