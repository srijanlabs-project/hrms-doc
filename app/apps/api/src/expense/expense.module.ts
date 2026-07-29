import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DelegationModule } from "../auth/delegation/delegation.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { WebhookModule } from "../webhook/webhook.module";
import { ExpenseClaimController } from "./expense-claim.controller";
import { ExpenseClaimRepository } from "./expense-claim.repository";
import { ExpenseClaimService } from "./expense-claim.service";
import { PerDiemClaimController } from "./per-diem/per-diem-claim.controller";
import { PerDiemClaimRepository } from "./per-diem/per-diem-claim.repository";
import { PerDiemPolicyController } from "./per-diem/per-diem-policy.controller";
import { PerDiemPolicyRepository } from "./per-diem/per-diem-policy.repository";
import { PerDiemService } from "./per-diem/per-diem.service";

/** Expense Management, Wave 4 — docs/08-submodule-specifications/17-expense-management/01-expense-claims.md. */
@Module({
  imports: [AuthModule, DelegationModule, PeopleModule, NotificationsModule, WebhookModule],
  controllers: [ExpenseClaimController, PerDiemPolicyController, PerDiemClaimController],
  providers: [
    ExpenseClaimService,
    ExpenseClaimRepository,
    PerDiemService,
    PerDiemPolicyRepository,
    PerDiemClaimRepository,
  ],
  exports: [ExpenseClaimRepository],
})
export class ExpenseModule {}
