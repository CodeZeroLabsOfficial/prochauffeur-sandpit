import Badge from "@/components/ui/badge/Badge";
import { statusLabel } from "@/lib/prochauffeur/display";
import type { TripStatus } from "@/lib/prochauffeur/types";
import { tripStatusBadgeColor } from "@/lib/prochauffeur/types";

export default function TripStatusBadge({ status }: { status: TripStatus }) {
  return (
    <Badge color={tripStatusBadgeColor(status)} variant="light">
      {statusLabel(status)}
    </Badge>
  );
}
