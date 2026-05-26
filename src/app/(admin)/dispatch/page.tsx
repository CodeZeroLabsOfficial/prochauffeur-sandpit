import DispatchMapView from "@/components/prochauffeur/DispatchMapView";
import { pageTitle } from "@/lib/prochauffeur/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageTitle("Dispatch"),
  description: "Live dispatch map and active trips.",
};

export default function DispatchPage() {
  return <DispatchMapView />;
}
