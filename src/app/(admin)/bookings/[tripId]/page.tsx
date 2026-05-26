import TripDetailView from "@/components/prochauffeur/TripDetailView";
import { pageTitle } from "@/lib/prochauffeur/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageTitle("Trip detail"),
  description: "Trip detail and dispatch actions.",
};

type Props = {
  params: Promise<{ tripId: string }>;
};

export default async function TripDetailPage({ params }: Props) {
  const { tripId } = await params;
  return <TripDetailView tripId={tripId} />;
}
