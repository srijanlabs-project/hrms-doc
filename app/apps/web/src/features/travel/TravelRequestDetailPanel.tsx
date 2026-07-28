import { TravelAdvancePanel } from "./TravelAdvancePanel";
import { TravelItineraryPanel } from "./TravelItineraryPanel";
import { TravelSettlementPanel } from "./TravelSettlementPanel";

/** Self-service detail view for one of my own trips: itinerary, advance, and live settlement. */
export function TravelRequestDetailPanel({ travelRequestId }: { travelRequestId: string }) {
  return (
    <div className="space-y-4">
      <TravelItineraryPanel travelRequestId={travelRequestId} />
      <TravelAdvancePanel travelRequestId={travelRequestId} />
      <TravelSettlementPanel travelRequestId={travelRequestId} />
    </div>
  );
}
