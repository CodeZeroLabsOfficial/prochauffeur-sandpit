import OverviewDashboard from "@/components/prochauffeur/OverviewDashboard";
import { pageTitle } from "@/lib/prochauffeur/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageTitle("Overview"),
  description: "Fleet operations overview for ProChauffeur dispatch.",
};

export default function OverviewPage() {
  return <OverviewDashboard />;
}
