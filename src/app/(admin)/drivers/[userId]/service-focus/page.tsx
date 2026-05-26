import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("driverServiceFocus");

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function DriverServiceFocusPage({ params }: Props) {
  const { userId } = await params;
  return (
    <DynamicStubPage stubKey="driverServiceFocus" routeParams={{ userId }} />
  );
}
