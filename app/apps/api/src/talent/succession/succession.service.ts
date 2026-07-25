import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import type { AddSuccessorDto } from "./dto/add-successor.dto";
import type { CreateCriticalRoleDto } from "./dto/create-critical-role.dto";
import type { UpdateSuccessorDto } from "./dto/update-successor.dto";
import { SuccessionRepository } from "./succession.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];
const COVERED_READINESS = ["ReadyNow"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-SUCCESSION-001",
    code: "SUCCESSION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-CRITICAL-ROLE",
    details: { currentState },
  });
}

/**
 * v1 slice of 01-succession-planning.md: collapses succession_cycle/
 * succession_slate/succession_risk_indicator/succession_development_action
 * into two flat tables — critical roles stay critical until deactivated (no
 * versioned review cycle), successors are added/removed directly (no
 * slate/calibration workflow), and there are no risk indicators (no
 * flight-risk/retirement-risk data source exists in this build). The whole
 * module is org_admin/hr_ops only per the spec's confidentiality
 * requirement (section 10) — no employee self-service view of successor
 * status. The nightly coverage sweep reuses the same @Cron pattern
 * established by ComplianceCalendarService.
 */
@Injectable()
export class SuccessionService {
  private readonly logger = new Logger(SuccessionService.name);

  constructor(
    private readonly repository: SuccessionRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createRole(dto: CreateCriticalRoleDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.createRole(tenantId, {
      title: dto.title,
      departmentId: dto.departmentId,
      incumbentEmployeeId: dto.incumbentEmployeeId,
      criticalityTier: dto.criticalityTier,
      createdByUserId: userId,
    });
  }

  async listRoles(activeOnly = true) {
    const { tenantId } = this.requireAuthenticated();
    const roles = await this.repository.findRoles(tenantId, activeOnly);
    return roles.map((role) => ({ ...role, hasReadyCoverage: hasReadyCoverage(role.successors) }));
  }

  async deactivateRole(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const role = await this.findRoleOrThrow(tenantId, id);
    if (!role.isActive) {
      throw stateConflict("This critical role is already inactive.", "Inactive");
    }
    return this.repository.setRoleActive(tenantId, id, false);
  }

  async addSuccessor(criticalRoleId: string, dto: AddSuccessorDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const role = await this.findRoleOrThrow(tenantId, criticalRoleId);
    if (!role.isActive) {
      throw stateConflict("Cannot add a successor to an inactive critical role.", "Inactive");
    }
    try {
      return await this.repository.addSuccessor(tenantId, criticalRoleId, {
        employeeId: dto.employeeId,
        readiness: dto.readiness,
        isEmergency: dto.isEmergency,
        notes: dto.notes,
        createdByUserId: userId,
      });
    } catch {
      throw new ValidationAppError([
        { field: "employeeId", code: "DUPLICATE", message: "This employee is already a successor for this role." },
      ]);
    }
  }

  async updateSuccessor(id: string, dto: UpdateSuccessorDto) {
    const { tenantId } = this.requireAuthenticated();
    await this.findSuccessorOrThrow(tenantId, id);
    return this.repository.updateSuccessor(tenantId, id, dto);
  }

  async removeSuccessor(id: string) {
    const { tenantId } = this.requireAuthenticated();
    await this.findSuccessorOrThrow(tenantId, id);
    return this.repository.removeSuccessor(tenantId, id);
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.checkCoverage(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.checkCoverage(tenantId);
  }

  private async checkCoverage(tenantId: string): Promise<void> {
    const roles = await this.repository.findRoles(tenantId, true);
    const uncovered = roles.filter((role) => !hasReadyCoverage(role.successors));
    if (uncovered.length === 0) return;

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    for (const role of uncovered) {
      for (const admin of admins) {
        await this.notificationService.notify(tenantId, admin.id, {
          type: "succession.coverage.at-risk",
          title: "Critical role lacks successor coverage",
          body: `"${role.title}" has no ready-now or emergency successor.`,
          linkPath: "/talent/succession",
        });
      }
    }
    this.logger.log(`Tenant ${tenantId}: ${uncovered.length} critical role(s) lack successor coverage.`);
  }

  private async findRoleOrThrow(tenantId: string, id: string) {
    const role = await this.repository.findRoleById(tenantId, id);
    if (!role) {
      throw new NotFoundAppError("OBJ-CRITICAL-ROLE", "Critical role not found.");
    }
    return role;
  }

  private async findSuccessorOrThrow(tenantId: string, id: string) {
    const successor = await this.repository.findSuccessorById(tenantId, id);
    if (!successor) {
      throw new NotFoundAppError("OBJ-SUCCESSION-SUCCESSOR", "Successor not found.");
    }
    return successor;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}

function hasReadyCoverage(successors: Array<{ readiness: string; isEmergency: boolean }>): boolean {
  return successors.some((s) => COVERED_READINESS.includes(s.readiness) || s.isEmergency);
}
