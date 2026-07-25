import { Module } from "@nestjs/common";
import { ExpenseModule } from "../expense/expense.module";
import { LeaveModule } from "../leave/leave.module";
import { PeopleModule } from "../people/people.module";
import { TravelModule } from "../travel/travel.module";
import { RequestsHubController } from "./requests-hub.controller";
import { RequestsHubService } from "./requests-hub.service";

/** Employee Self Service (E04) — unified Requests hub, 04-employee-self-service/01-requests.md v1 slice. */
@Module({
  imports: [LeaveModule, ExpenseModule, TravelModule, PeopleModule],
  controllers: [RequestsHubController],
  providers: [RequestsHubService],
})
export class RequestsHubModule {}
