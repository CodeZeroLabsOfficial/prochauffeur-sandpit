import {
  DynamicStubPage,
  dynamicStubMetadata,
} from "@/lib/prochauffeur/dynamicStubPage";

export const metadata = dynamicStubMetadata("locationEdit");

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LocationEditPage({ params }: Props) {
  const { id } = await params;
  return <DynamicStubPage stubKey="locationEdit" routeParams={{ id }} />;
}
