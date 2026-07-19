import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { LeaveBalanceController } from "./balance/leave-balance.controller";
import { LeaveBalanceService } from "./balance/leave-balance.service";
import { CurrentEmployeeService } from "./current-employee.service";
import { LeavePolicyController } from "./policy/leave-policy.controller";
import { LeavePolicyRepository } from "./policy/leave-policy.repository";
import { LeavePolicyService } from "./policy/leave-policy.service";
import { LeaveRequestController } from "./request/leave-request.controller";
import { LeaveRequestRepository } from "./request/leave-request.repository";
import { LeaveRequestService } from "./request/leave-request.service";

/** Leave module, Phase 4's first workflow vertical — docs/03-module-specifications/08-leave-management.md. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [LeavePolicyController, LeaveBalanceController, LeaveRequestController],
  providers: [
    LeavePolicyService,
    LeavePolicyRepository,
    LeaveRequestService,
    LeaveRequestRepository,
    LeaveBalanceService,
    CurrentEmployeeService,
  ],
})
export class LeaveModule {}
