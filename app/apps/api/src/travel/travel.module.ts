import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DelegationModule } from "../auth/delegation/delegation.module";
import { ExpenseModule } from "../expense/expense.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { TravelAdvanceController } from "./advance/travel-advance.controller";
import { TravelAdvanceRepository } from "./advance/travel-advance.repository";
import { TravelAdvanceService } from "./advance/travel-advance.service";
import { ItinerarySegmentController } from "./itinerary/itinerary-segment.controller";
import { ItinerarySegmentRepository } from "./itinerary/itinerary-segment.repository";
import { ItinerarySegmentService } from "./itinerary/itinerary-segment.service";
import { TravelSettlementController } from "./settlement/travel-settlement.controller";
import { TravelSettlementService } from "./settlement/travel-settlement.service";
import { TravelRequestController } from "./travel-request.controller";
import { TravelRequestRepository } from "./travel-request.repository";
import { TravelRequestService } from "./travel-request.service";

/**
 * Travel Management, Wave 4 — docs/08-submodule-specifications/16-travel-management/01-travel-requests.md.
 * Deepened per Wave 3 E16 gap closure with trip planning + itinerary
 * (leg-by-leg segments on a request — planning a trip IS building its
 * itinerary), travel advances (cash-advance request against a trip, no
 * repayment schedule), and travel expense settlement (always computed live
 * from linked advances/expense claims, never stored). Booking-tool
 * integration stays deferred — no vendor infra in this build.
 */
@Module({
  imports: [AuthModule, DelegationModule, PeopleModule, NotificationsModule, ExpenseModule],
  controllers: [
    TravelRequestController,
    ItinerarySegmentController,
    TravelAdvanceController,
    TravelSettlementController,
  ],
  providers: [
    TravelRequestService,
    TravelRequestRepository,
    ItinerarySegmentService,
    ItinerarySegmentRepository,
    TravelAdvanceService,
    TravelAdvanceRepository,
    TravelSettlementService,
  ],
  exports: [TravelRequestRepository],
})
export class TravelModule {}
