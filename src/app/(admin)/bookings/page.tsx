import BookingsList from "@/components/prochauffeur/BookingsList";
import { pageTitle } from "@/lib/prochauffeur/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: pageTitle("Bookings"),
  description: "Upcoming and active trip queue.",
};

export default function BookingsPage() {
  return <BookingsList />;
}
