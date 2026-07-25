import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { CertificationRepository, RecordWithRefs } from "./certification.repository";
import type { CreateCertificationCatalogDto } from "./dto/create-catalog-entry.dto";
import type { CreateCertificationRecordDto } from "./dto/create-record.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];
const EXPIRY_REMINDER_DAYS = 30;

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-CERTIFICATION-001",
    code: "CERTIFICATION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-CERTIFICATION-RECORD",
    details: { currentState },
  });
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * v1 slice of 02-certifications.md: collapses certification_requirement/
 * certification_verification/certification_renewal_case/equivalency-mapping
 * into a flat catalog plus one record per employee. A record starts Active
 * immediately (no Draft/PendingVerification gate — verification is an
 * after-the-fact admin confirmation, not a blocker), and nothing in this
 * build currently gates staffing eligibility on certification state, so no
 * role-eligibility rule engine was built. The daily sweep reuses the
 * Scheduler-engine cron pattern from ComplianceCalendarService.
 */
@Injectable()
export class CertificationService {
  private readonly logger = new Logger(CertificationService.name);

  constructor(
    private readonly repository: CertificationRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createCatalogEntry(dto: CreateCertificationCatalogDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.createCatalogEntry(tenantId, dto);
    } catch {
      throw new ValidationAppError([
        { field: "code", code: "DUPLICATE", message: `A certification with code "${dto.code}" already exists.` },
      ]);
    }
  }

  async listCatalog() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findCatalog(tenantId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  async createRecord(dto: CreateCertificationRecordDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    let employeeId = dto.employeeId;
    if (employeeId) {
      const user = await this.authRepository.findUserById(tenantId, userId);
      if (!user?.roles.some((role) => ADMIN_ROLES.includes(role))) {
        throw new ForbiddenAppError(this.requestContext.correlationId);
      }
    } else {
      const { employee } = await this.currentEmployee.resolve();
      employeeId = employee.id;
    }

    const catalogEntry = await this.repository.findCatalogById(tenantId, dto.certificationCatalogId);
    if (!catalogEntry) {
      throw new NotFoundAppError("OBJ-CERTIFICATION-CATALOG", "Certification catalog entry not found.");
    }

    const issueDate = new Date(dto.issueDate);
    const expiryDate = catalogEntry.validityMonths ? addMonths(issueDate, catalogEntry.validityMonths) : null;

    return this.repository.createRecord(tenantId, {
      employeeId,
      certificationCatalogId: dto.certificationCatalogId,
      certificateNumber: dto.certificateNumber,
      issueDate,
      expiryDate,
      evidenceFileId: dto.evidenceFileId,
    });
  }

  async verify(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const record = await this.findOrThrow(tenantId, id);
    if (record.status === "Revoked") {
      throw stateConflict("A revoked certification cannot be verified.", record.status);
    }
    return this.repository.updateStatus(tenantId, id, { verifiedByUserId: userId, verifiedAt: new Date() });
  }

  async revoke(id: string, reason: string) {
    const { tenantId } = this.requireAuthenticated();
    const record = await this.findOrThrow(tenantId, id);
    if (record.status === "Revoked") {
      throw stateConflict("This certification is already revoked.", record.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Revoked", revokedReason: reason });
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.sweepExpiry(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.sweepExpiry(tenantId);
  }

  private async sweepExpiry(tenantId: string): Promise<void> {
    const records = await this.repository.findActiveOrExpiring(tenantId);
    const now = new Date();
    let expired = 0;
    let flagged = 0;

    for (const record of records) {
      if (!record.expiryDate) continue;
      if (record.expiryDate < now) {
        await this.repository.updateStatus(tenantId, record.id, { status: "Expired" });
        await this.notifyExpiry(tenantId, record, "has expired");
        expired++;
        continue;
      }
      const daysUntilDue = Math.ceil((record.expiryDate.getTime() - now.getTime()) / 86_400_000);
      if (daysUntilDue <= EXPIRY_REMINDER_DAYS && record.status !== "Expiring") {
        await this.repository.updateStatus(tenantId, record.id, { status: "Expiring" });
        await this.notifyExpiry(tenantId, record, "is expiring soon");
        flagged++;
      }
    }
    this.logger.log(`Tenant ${tenantId}: ${expired} certification(s) expired, ${flagged} flagged as expiring.`);
  }

  private async notifyExpiry(tenantId: string, record: RecordWithRefs, phrase: string): Promise<void> {
    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, record.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: "certification.expiry",
        title: `Certification ${phrase}`,
        body: `Your "${record.certification.name}" certification ${phrase}.`,
        linkPath: "/learning/certifications",
      });
    }
    if (!record.certification.isMandatory) return;
    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    for (const admin of admins) {
      await this.notificationService.notify(tenantId, admin.id, {
        type: "certification.expiry.mandatory",
        title: `Mandatory certification ${phrase}`,
        body: `${record.employee.legalName}'s "${record.certification.name}" certification ${phrase}.`,
        linkPath: "/learning/certifications",
      });
    }
  }

  private async findOrThrow(tenantId: string, id: string) {
    const record = await this.repository.findById(tenantId, id);
    if (!record) {
      throw new NotFoundAppError("OBJ-CERTIFICATION-RECORD", "Certification record not found.");
    }
    return record;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
