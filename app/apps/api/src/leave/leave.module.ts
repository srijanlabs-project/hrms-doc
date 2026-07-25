import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DelegationModule } from "../auth/delegation/delegation.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { WorkCalendarRepository } from "../org/work-calendar/work-calendar.repository";
import { ArrearRepository } from "../payroll/arrear/arrear.repository";
import { CompensationRepository } from "../payroll/compensation/compensation.repository";
import { PeopleModule } from "../people/people.module";
import { WebhookModule } from "../webhook/webhook.module";
import { LeaveBalanceController } from "./balance/leave-balance.controller";
import { LeaveBalanceService } from "./balance/leave-balance.service";
import { LeaveEncashmentController } from "./encashment/leave-encashment.controller";
import { LeaveEncashmentRepository } from "./encashment/leave-encashment.repository";
import { LeaveEncashmentService } from "./encashment/leave-encashment.service";
import { LeaveLedgerController } from "./ledger/leave-ledger.controller";
import { LeaveLedgerRepository } from "./ledger/leave-ledger.repository";
import { LeaveLedgerService } from "./ledger/leave-ledger.service";
import { LeavePolicyController } from "./policy/leave-policy.controller";
import { LeavePolicyRepository } from "./policy/leave-policy.repository";
import { LeavePolicyService } from "./policy/leave-policy.service";
import { LeaveRequestController } from "./request/leave-request.controller";
import { LeaveRequestRepository } from "./request/leave-request.repository";
import { LeaveRequestService } from "./request/leave-request.service";

/**
 * Leave module, Phase 4's first workflow vertical — docs/03-module-specifications/08-leave-management.md.
 * WorkCalendarRepository/ArrearRepository/CompensationRepository declared
 * directly (not imported via OrgModule/PayrollModule) since all three depend
 * only on PrismaService — avoids pulling in each module's full dependency graph.
 */
@Module({
  imports: [AuthModule, DelegationModule, PeopleModule, NotificationsModule, WebhookModule],
  controllers: [LeavePolicyController, LeaveBalanceController, LeaveRequestController, LeaveLedgerController, LeaveEncashmentController],
  providers: [
    LeavePolicyService,
    LeavePolicyRepository,
    LeaveRequestService,
    LeaveRequestRepository,
    LeaveBalanceService,
    LeaveLedgerService,
    LeaveLedgerRepository,
    LeaveEncashmentService,
    LeaveEncashmentRepository,
    WorkCalendarRepository,
    ArrearRepository,
    CompensationRepository,
  ],
  exports: [LeaveRequestRepository, LeaveBalanceService],
})
export class LeaveModule {}
