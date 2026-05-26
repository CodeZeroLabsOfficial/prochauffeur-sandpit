import LocationFormView from "@/components/prochauffeur/LocationFormView";

export const metadata = {
  title: "Edit location | ProChauffeur Dispatch",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditLocationPage({ params }: Props) {
  const { id } = await params;
  return <LocationFormView locationId={id} />;
}
