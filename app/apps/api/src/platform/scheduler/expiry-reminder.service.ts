import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../prisma/prisma.service";

const REMINDER_WINDOW_DAYS = 30;
const PROBATION_WINDOW_DAYS = 7;

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Scheduler engine (Foundation & Platform, E00) — one cron-driven job runner
 * serving three different expiry reminder types through the existing
 * Notification engine, rather than three ad hoc timers. No dedupe/suppression
 * tracking yet: an item inside the window gets a reminder on every run until
 * it leaves the window (e.g. is renewed or decided) — acceptable for a v1,
 * revisit if reminder fatigue becomes a real complaint.
 */
@Injectable()
export class ExpiryReminderService {
  private readonly logger = new Logger(ExpiryReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    private readonly authRepository: AuthRepository,
  ) {}

  /** Internal system job — the only caller allowed to iterate every tenant. */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async runDailyCheck(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.runForTenant(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant, never cross-tenant. */
  async runForTenant(tenantId: string): Promise<void> {
    await this.checkIdentityDocumentExpiry(tenantId);
    await this.checkContractEndDate(tenantId);
    await this.checkProbationEnd(tenantId);
  }

  private async notifyEmployee(tenantId: string, employeeId: string, input: Parameters<NotificationService["notify"]>[2]) {
    const user = await this.authRepository.findUserByEmployeeId(tenantId, employeeId);
    if (!user) return;
    await this.notificationService.notify(tenantId, user.id, input);
  }

  private async checkIdentityDocumentExpiry(tenantId: string): Promise<void> {
    const documents = await this.prisma.withTenant(tenantId, (tx) =>
      tx.identityDocument.findMany({
        where: { tenantId, expiryDate: { gte: new Date(), lte: daysFromNow(REMINDER_WINDOW_DAYS) } },
      }),
    );
    for (const doc of documents) {
      await this.notifyEmployee(tenantId, doc.employeeId, {
        type: "identity-document.expiring",
        title: `${doc.documentType} expiring soon`,
        body: `Your ${doc.documentType} (${doc.documentNumber}) expires on ${doc.expiryDate?.toLocaleDateString("en-IN")}.`,
        linkPath: "/people/employees",
      });
    }
    this.logger.log(`Tenant ${tenantId}: ${documents.length} identity document(s) expiring within ${REMINDER_WINDOW_DAYS} days.`);
  }

  private async checkContractEndDate(tenantId: string): Promise<void> {
    const employees = await this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findMany({
        where: { tenantId, status: "Active", contractEndDate: { gte: new Date(), lte: daysFromNow(REMINDER_WINDOW_DAYS) } },
      }),
    );
    for (const employee of employees) {
      await this.notifyEmployee(tenantId, employee.id, {
        type: "contract.expiring",
        title: "Your contract is ending soon",
        body: `Your current contract ends on ${employee.contractEndDate?.toLocaleDateString("en-IN")}.`,
        linkPath: "/people/employees",
      });
    }
    this.logger.log(`Tenant ${tenantId}: ${employees.length} contract(s) ending within ${REMINDER_WINDOW_DAYS} days.`);
  }

  private async checkProbationEnd(tenantId: string): Promise<void> {
    const records = await this.prisma.withTenant(tenantId, (tx) =>
      tx.probationRecord.findMany({
        where: {
          tenantId,
          status: { in: ["OnProbation", "Extended"] },
          endDate: { gte: new Date(), lte: daysFromNow(PROBATION_WINDOW_DAYS) },
        },
      }),
    );
    for (const record of records) {
      await this.notifyEmployee(tenantId, record.employeeId, {
        type: "probation.ending",
        title: "Probation period ending soon",
        body: `Probation ends on ${record.endDate.toLocaleDateString("en-IN")} — a confirmation decision is due.`,
        linkPath: "/people/employees",
      });
    }
    this.logger.log(`Tenant ${tenantId}: ${records.length} probation record(s) ending within ${PROBATION_WINDOW_DAYS} days.`);
  }
}
