import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateLicenseDto } from "./dto/create-license.dto";
import { LicenseRepository } from "./license.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function seatLimitConflict(licenseName: string) {
  return new AppError({
    errorRef: "ERR-LICENSE-001",
    code: "LICENSE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message: `All seats for "${licenseName}" are already assigned.`,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SOFTWARE-LICENSE",
  });
}

/**
 * Wave 4·E18 gap closure ("software licenses") — seat-based catalog mirroring
 * Asset/AssetAssignment's shape but for software: no physical return, a
 * revoke just frees the seat. Seats used is always computed live from active
 * assignments (never stored), the same live-computation discipline used
 * throughout this build.
 */
@Injectable()
export class LicenseService {
  private readonly logger = new Logger(LicenseService.name);

  constructor(
    private readonly repository: LicenseRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateLicenseDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      name: dto.name,
      vendor: dto.vendor,
      totalSeats: dto.totalSeats,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
    });
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.withSeatsUsed(await this.repository.findAll(tenantId));
  }

  async listActive() {
    const { tenantId } = this.requireAuthenticated();
    return this.withSeatsUsed(await this.repository.findActive(tenantId));
  }

  async assign(dto: { licenseId: string; employeeId: string }) {
    const { tenantId, userId } = this.requireAuthenticated();

    const license = await this.repository.findById(tenantId, dto.licenseId);
    if (!license || license.status !== "Active") {
      throw new NotFoundAppError("OBJ-SOFTWARE-LICENSE", "Software license not found.");
    }
    if (license.assignments.length >= license.totalSeats) {
      throw seatLimitConflict(license.name);
    }

    const assignment = await this.repository.createAssignment(tenantId, {
      licenseId: dto.licenseId,
      employeeId: dto.employeeId,
      assignedByUserId: userId,
    });

    const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, dto.employeeId);
    if (employeeUser) {
      await this.notificationService.notify(tenantId, employeeUser.id, {
        type: "license.assigned",
        title: "Software license assigned",
        body: `A seat for "${license.name}" has been assigned to you.`,
        linkPath: "/assets",
      });
    }

    return assignment;
  }

  async revoke(assignmentId: string) {
    const { tenantId } = this.requireAuthenticated();
    const assignment = await this.repository.findAssignmentById(tenantId, assignmentId);
    if (!assignment) {
      throw new NotFoundAppError("OBJ-SOFTWARE-LICENSE-ASSIGNMENT", "License assignment not found.");
    }
    const count = await this.repository.revoke(tenantId, assignmentId);
    if (count === 0) {
      throw new AppError({
        errorRef: "ERR-LICENSE-002",
        code: "LICENSE-002",
        category: "state-conflict",
        severity: "medium",
        httpStatus: 409,
        message: "Only an active assignment can be revoked.",
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-SOFTWARE-LICENSE-ASSIGNMENT",
      });
    }
    return this.repository.findAssignmentById(tenantId, assignmentId);
  }

  async listMyAssignments() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findAssignmentsForEmployee(tenantId, employee.id);
  }

  async listAllAssignments() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAssignments(tenantId);
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.sweepExpiry(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runExpirySweepNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.sweepExpiry(tenantId);
  }

  private async sweepExpiry(tenantId: string): Promise<void> {
    const candidates = await this.repository.findExpiryCandidates(tenantId);
    const now = new Date();
    const expired = candidates.filter((license) => license.expiryDate && license.expiryDate < now);
    if (expired.length === 0) return;

    await this.repository.markExpired(tenantId, expired.map((l) => l.id));

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    for (const license of expired) {
      for (const admin of admins) {
        await this.notificationService.notify(tenantId, admin.id, {
          type: "license.expired",
          title: "Software license expired",
          body: `"${license.name}" expired on ${license.expiryDate?.toLocaleDateString("en-IN")}.`,
          linkPath: "/assets",
        });
      }
    }
    this.logger.log(`Expired ${expired.length} software license(s) for tenant ${tenantId}.`);
  }

  private withSeatsUsed<T extends { assignments: { id: string }[] }>(licenses: T[]) {
    return licenses.map(({ assignments, ...license }) => ({ ...license, seatsUsed: assignments.length }));
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
