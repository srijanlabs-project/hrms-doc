import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DelegationModule } from "../auth/delegation/delegation.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { TravelRequestController } from "./travel-request.controller";
import { TravelRequestRepository } from "./travel-request.repository";
import { TravelRequestService } from "./travel-request.service";

/** Travel Management, Wave 4 — docs/08-submodule-specifications/16-travel-management/01-travel-requests.md. */
@Module({
  imports: [AuthModule, DelegationModule, PeopleModule, NotificationsModule],
  controllers: [TravelRequestController],
  providers: [TravelRequestService, TravelRequestRepository],
  exports: [TravelRequestRepository],
})
export class TravelModule {}
