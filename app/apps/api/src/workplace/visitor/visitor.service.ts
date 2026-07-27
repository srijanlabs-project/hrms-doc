import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateVisitorDto } from "./dto/create-visitor.dto";
import { VisitorRepository } from "./visitor.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-VISITOR-001",
    code: "VISITOR-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-VISITOR",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/03-module-specifications/21-visitor-workplace-management.md.
 * See schema.prisma's Visitor comment for the collapsed gate-pass/check-in
 * decision. Approve/Cancel: the host employee or org_admin/hr_ops. Check-in/
 * check-out (reception actions): org_admin/hr_ops only, since there's no
 * badge/QR device in this environment to drive them automatically.
 */
@Injectable()
export class VisitorService {
  private readonly logger = new Logger(VisitorService.name);

  constructor(
    private readonly repository: VisitorRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateVisitorDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.create(tenantId, {
      fullName: dto.fullName,
      company: dto.company,
      phone: dto.phone,
      email: dto.email,
      purpose: dto.purpose,
      hostEmployeeId: employee.id,
      scheduledAt: new Date(dto.scheduledAt),
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForHost(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  async approve(id: string) {
    const { tenantId } = await this.assertHostOrAdmin(id);
    const visitor = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Requested"], {
      status: "Approved",
      approvedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only a Requested visit can be approved.", visitor.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async cancel(id: string) {
    const { tenantId } = await this.assertHostOrAdmin(id);
    const visitor = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Requested", "Approved"], { status: "Cancelled" });
    if (count === 0) {
      throw stateConflict("Only a Requested or Approved visit can be cancelled.", visitor.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** Reception action — org_admin/hr_ops only, see controller's @Roles guard. */
  async checkIn(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const visitor = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Approved"], {
      status: "CheckedIn",
      checkedInAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only an Approved visit can be checked in.", visitor.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** Reception action — org_admin/hr_ops only, see controller's @Roles guard. */
  async checkOut(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const visitor = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["CheckedIn"], {
      status: "CheckedOut",
      checkedOutAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only a Checked-In visit can be checked out.", visitor.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.sweepExpired(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runExpirySweepNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.sweepExpired(tenantId);
  }

  private async sweepExpired(tenantId: string): Promise<void> {
    const candidates = await this.repository.findExpiredCandidates(tenantId);
    if (candidates.length === 0) return;

    await this.repository.markExpired(tenantId, candidates.map((v) => v.id));
    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.flatMap((admin) =>
        candidates.map((visitor) =>
          this.notificationService.notify(tenantId, admin.id, {
            type: "visitor.expired",
            title: "Visit expired",
            body: `${visitor.fullName}'s scheduled visit passed without check-in.`,
            linkPath: "/workplace",
          }),
        ),
      ),
    );
    this.logger.log(`Expired ${candidates.length} visit(s) for tenant ${tenantId}.`);
  }

  private async assertHostOrAdmin(id: string) {
    const { tenantId, userId, employee } = await this.currentEmployee.resolve();
    const isAdmin = ADMIN_ROLES.some((role) => this.requestContext.roles.includes(role));
    const visitor = await this.findOrThrow(tenantId, id);
    if (!isAdmin && visitor.hostEmployeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId, employee };
  }

  private async findOrThrow(tenantId: string, id: string) {
    const visitor = await this.repository.findById(tenantId, id);
    if (!visitor) {
      throw new NotFoundAppError("OBJ-VISITOR", "Visitor not found.");
    }
    return visitor;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
