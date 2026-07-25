import { Controller, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { RequestContextService } from "../context/request-context.service";
import { AuthenticationAppError } from "../errors/errors";
import { ExpiryReminderService } from "./expiry-reminder.service";

/**
 * Ops "run now" trigger for the Scheduler engine's daily cron job — HTTP
 * only, no business logic. Always scoped to the caller's own tenant (never
 * the cross-tenant loop the cron job itself runs).
 */
@Roles("org_admin", "hr_ops")
@Controller("scheduler")
export class SchedulerController {
  constructor(
    private readonly expiryReminderService: ExpiryReminderService,
    private readonly requestContext: RequestContextService,
  ) {}

  @Post("run-expiry-check")
  @HttpCode(200)
  async runNow() {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    await this.expiryReminderService.runForTenant(tenantId);
    return { data: { triggered: true } };
  }
}
