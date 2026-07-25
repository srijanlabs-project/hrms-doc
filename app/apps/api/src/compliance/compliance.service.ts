import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../auth/auth.repository";
import { NotificationService } from "../notifications/notification.service";
import { PrismaService } from "../platform/prisma/prisma.service";
import { RequestContextService } from "../platform/context/request-context.service";
import { AppError } from "../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../platform/errors/errors";
import type { CompleteTaskDto } from "./dto/complete-task.dto";
import type { CreateObligationDto } from "./dto/create-obligation.dto";
import { ComplianceRepository } from "./compliance.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function periodLabel(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-COMPLIANCE-001",
    code: "COMPLIANCE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-COMPLIANCE-TASK",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/10-statutory-and-compliance/05-compliance-calendar.md.
 * Collapses compliance_obligation/compliance_task_dependency/
 * compliance_escalation_rule into a flat catalog + monthly task generation —
 * no dependency chains, no maker-checker, single-entity (no jurisdiction
 * mapping — see schema.prisma's model comment). Country-specific compliance
 * (04-country-specific-compliance.md) stays a documented deferral: this
 * tenant operates in one country, so a multi-country rule-pack abstraction
 * would be speculative infrastructure with no second jurisdiction to prove
 * it against.
 */
@Injectable()
export class ComplianceCalendarService {
  private readonly logger = new Logger(ComplianceCalendarService.name);

  constructor(
    private readonly repository: ComplianceRepository,
    private readonly prisma: PrismaService,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createObligation(dto: CreateObligationDto) {
    const { tenantId } = this.requireAuthenticated();
    const existing = await this.repository.findObligationByCode(tenantId, dto.code);
    if (existing) {
      throw new ValidationAppError([{ field: "code", code: "DUPLICATE", message: `An obligation with code "${dto.code}" already exists.` }]);
    }
    return this.repository.createObligation(tenantId, dto);
  }

  async listObligations() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAllObligations(tenantId);
  }

  async listTasks(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listTasks(tenantId, status);
  }

  async complete(id: string, dto: CompleteTaskDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const task = await this.findTaskOrThrow(tenantId, id);
    if (task.status !== "Open" && task.status !== "Overdue") {
      throw stateConflict(`This task is already ${task.status.toLowerCase()}.`, task.status);
    }
    return this.repository.updateStatus(tenantId, id, {
      status: "Completed",
      completedByUserId: userId,
      completedAt: new Date(),
      evidenceFileId: dto.evidenceFileId,
      note: dto.note,
    });
  }

  async waive(id: string, note: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const task = await this.findTaskOrThrow(tenantId, id);
    if (task.status !== "Open" && task.status !== "Overdue") {
      throw stateConflict(`This task is already ${task.status.toLowerCase()}.`, task.status);
    }
    return this.repository.updateStatus(tenantId, id, {
      status: "Waived",
      completedByUserId: userId,
      completedAt: new Date(),
      note,
    });
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.runForTenant(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. Generates this month's tasks, sweeps overdue, and sends due-soon reminders. */
  async runForTenant(tenantId: string): Promise<void> {
    await this.generateForTenant(tenantId);
    await this.sweepOverdue(tenantId);
    await this.sendReminders(tenantId);
  }

  private async generateForTenant(tenantId: string): Promise<void> {
    const now = new Date();
    const label = periodLabel(now.getUTCFullYear(), now.getUTCMonth() + 1);
    const obligations = await this.repository.listActiveObligations(tenantId);

    let created = 0;
    for (const obligation of obligations) {
      const existing = await this.repository.findTaskForPeriod(tenantId, obligation.id, label);
      if (existing) continue;
      const dueDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), obligation.dueDayOfMonth));
      await this.repository.createTask(tenantId, { obligationId: obligation.id, periodLabel: label, dueDate });
      created++;
    }
    this.logger.log(`Tenant ${tenantId}: generated ${created} compliance task(s) for period ${label}.`);
  }

  private async sweepOverdue(tenantId: string): Promise<void> {
    const openTasks = await this.repository.findOpenTasks(tenantId);
    const today = new Date();
    let overdue = 0;
    for (const task of openTasks) {
      if (task.dueDate < today) {
        await this.repository.updateStatus(tenantId, task.id, { status: "Overdue" });
        overdue++;
      }
    }
    this.logger.log(`Tenant ${tenantId}: marked ${overdue} compliance task(s) overdue.`);
  }

  private async sendReminders(tenantId: string): Promise<void> {
    const openTasks = await this.repository.findOpenTasks(tenantId);
    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    const today = new Date();

    for (const task of openTasks) {
      const daysUntilDue = Math.ceil((task.dueDate.getTime() - today.getTime()) / 86_400_000);
      if (daysUntilDue < 0 || daysUntilDue > task.obligation.reminderDaysBefore) continue;
      for (const admin of admins) {
        await this.notificationService.notify(tenantId, admin.id, {
          type: "compliance.task.due-soon",
          title: `${task.obligation.name} due soon`,
          body: `${task.obligation.name} for ${task.periodLabel} is due on ${task.dueDate.toLocaleDateString("en-IN")}.`,
          linkPath: "/compliance",
        });
      }
    }
  }

  private async findTaskOrThrow(tenantId: string, id: string) {
    const task = await this.repository.findTaskById(tenantId, id);
    if (!task) {
      throw new NotFoundAppError("OBJ-COMPLIANCE-TASK", "Compliance task not found.");
    }
    return task;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
