import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { WebhookController } from "./webhook.controller";
import { WebhookRepository } from "./webhook.repository";
import { WebhookDispatchService } from "./webhook.service";

/**
 * Wave 2 W2·E27 Integration Platform — docs/08-submodule-specifications/27-integration-platform/.
 * Two concrete, real slices: outbound webhooks (this module, wired into
 * Leave/Expense/Payroll's real approval mutation points) and a bank-file
 * disbursement export (payroll/finance-export/, no schema of its own — a
 * computed CSV from already-real payroll + bank-account data). ERP,
 * identity-provider, and biometric-device integrations stay deferred — no
 * real external system in this environment to connect to; event streaming
 * stays deferred as speculative infrastructure with no consumer.
 */
@Module({
  imports: [AuthModule],
  controllers: [WebhookController],
  providers: [WebhookDispatchService, WebhookRepository],
  exports: [WebhookDispatchService],
})
export class WebhookModule {}
