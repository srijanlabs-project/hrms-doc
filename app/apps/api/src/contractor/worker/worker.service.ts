import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { AuthRepository } from "../../auth/auth.repository";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { AddDocumentDto } from "./dto/add-document.dto";
import type { CreateWorkerDto } from "./dto/create-worker.dto";
import type { RejectWorkerDto } from "./dto/reject-worker.dto";
import type { SuspendWorkerDto } from "./dto/suspend-worker.dto";
import { WorkerRepository } from "./worker.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-CONTRACTOR-001",
    code: "CONTRACTOR-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-EXTERNAL-WORKER",
    details: { currentState },
  });
}

/**
 * v1 slice — see schema.prisma's ExternalWorker comment for the collapsed
 * agency/assignment/access-control decisions. Entire module is
 * org_admin/hr_ops only — external workers have no Staffsy login of their
 * own, so there's no self-service surface to build.
 */
@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private readonly repository: WorkerRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateWorkerDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      vendorId: dto.vendorId,
      fullName: dto.fullName,
      email: dto.email,
      category: dto.category ?? "Contractor",
      contractStartDate: new Date(dto.contractStartDate),
      contractEndDate: new Date(dto.contractEndDate),
      departmentId: dto.departmentId,
      workLocation: dto.workLocation,
      createdByUserId: userId,
    });
  }

  async listAll(status?: string, vendorId?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, { status, vendorId });
  }

  async getById(id: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.findWorkerOrThrow(tenantId, id);
  }

  async submit(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Draft"], { status: "PendingApproval" });
    if (count === 0) {
      throw stateConflict("Only a Draft worker can be submitted for approval.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async approve(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["PendingApproval"], {
      status: "Active",
      accessGrantedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only a worker Pending Approval can be approved.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async reject(id: string, dto: RejectWorkerDto) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["PendingApproval"], {
      status: "Inactive",
      statusReason: dto.reason,
    });
    if (count === 0) {
      throw stateConflict("Only a worker Pending Approval can be rejected.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async suspend(id: string, dto: SuspendWorkerDto) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Active"], {
      status: "Suspended",
      accessRevokedAt: new Date(),
      statusReason: dto.reason,
    });
    if (count === 0) {
      throw stateConflict("Only an Active worker can be suspended.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async reactivate(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Suspended"], {
      status: "Active",
      accessRevokedAt: null,
      statusReason: null,
    });
    if (count === 0) {
      throw stateConflict("Only a Suspended worker can be reactivated.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async deactivate(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const worker = await this.findWorkerOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Active", "Expired", "Suspended"], {
      status: "Inactive",
      accessRevokedAt: new Date(),
    });
    if (count === 0) {
      throw stateConflict("Only an Active, Expired, or Suspended worker can be deactivated.", worker.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async addDocument(id: string, dto: AddDocumentDto) {
    const { tenantId } = this.requireAuthenticated();
    await this.findWorkerOrThrow(tenantId, id);
    return this.repository.addDocument(tenantId, { externalWorkerId: id, documentType: dto.documentType, fileId: dto.fileId });
  }

  async verifyDocument(documentId: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const document = await this.repository.findDocumentById(tenantId, documentId);
    if (!document) {
      throw new NotFoundAppError("OBJ-EXTERNAL-WORKER-DOCUMENT", "Document not found.");
    }
    const count = await this.repository.verifyDocument(tenantId, documentId, userId);
    if (count === 0) {
      throw stateConflict("This document is already verified.", "Verified");
    }
    return this.repository.findDocumentById(tenantId, documentId);
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_7AM)
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

    await this.repository.markExpired(tenantId, candidates.map((w) => w.id));
    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.flatMap((admin) =>
        candidates.map((worker) =>
          this.notificationService.notify(tenantId, admin.id, {
            type: "contractor.deactivated",
            title: "Contract expired",
            body: `${worker.fullName}'s contract has expired — access has been revoked.`,
            linkPath: "/contractors",
          }),
        ),
      ),
    );
    this.logger.log(`Expired ${candidates.length} external worker(s) for tenant ${tenantId}.`);
  }

  private async findWorkerOrThrow(tenantId: string, id: string) {
    const worker = await this.repository.findById(tenantId, id);
    if (!worker) {
      throw new NotFoundAppError("OBJ-EXTERNAL-WORKER", "External worker not found.");
    }
    return worker;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
