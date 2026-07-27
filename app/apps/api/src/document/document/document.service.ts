import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { AddDocumentVersionDto } from "./dto/add-document-version.dto";
import type { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentRepository } from "./document.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-DOCUMENT-001",
    code: "DOCUMENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-DOCUMENT",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/03-module-specifications/24-document-management.md.
 * Templates/generation already exist (DocumentTemplate/GeneratedDocument);
 * this is the remaining real gap — a versioned repository with retention.
 * State machine collapsed 6→4 (see schema.prisma's Document comment):
 * Signed drops entirely (no e-signature vendor), Generated+Shared merge into
 * Published. Admin-managed end to end (org_admin/hr_ops) — employees get a
 * read-only view of their own plus organization-wide published documents.
 */
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly repository: DocumentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async create(dto: CreateDocumentDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      title: dto.title,
      category: dto.category ?? "Other",
      employeeId: dto.employeeId,
      retentionPolicyId: dto.retentionPolicyId,
      createdByUserId: userId,
      fileId: dto.fileId,
      uploadedByUserId: userId,
      notes: dto.notes,
    });
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async addVersion(id: string, dto: AddDocumentVersionDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    await this.findOrThrow(tenantId, id);
    return this.repository.addVersion(tenantId, id, { fileId: dto.fileId, uploadedByUserId: userId, notes: dto.notes });
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const document = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Draft"], { status: "Published", publishedAt: new Date() });
    if (count === 0) {
      throw stateConflict("Only a Draft document can be published.", document.status);
    }
    return this.repository.findById(tenantId, id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async archive(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const document = await this.findOrThrow(tenantId, id);
    const count = await this.repository.transition(tenantId, id, ["Published"], { status: "Archived", archivedAt: new Date() });
    if (count === 0) {
      throw stateConflict("Only a Published document can be archived.", document.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId, status);
  }

  async findOne(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const document = await this.findOrThrow(tenantId, id);
    const isAdmin = ["org_admin", "hr_ops"].some((role) => this.requestContext.roles.includes(role));
    if (isAdmin) return document;

    const { employee } = await this.currentEmployee.resolve();
    const inScope = document.status === "Published" && (document.employeeId === null || document.employeeId === employee.id);
    if (!inScope) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return document;
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
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
    const expiredIds = candidates
      .filter((doc) => {
        const months = doc.retentionPolicy?.retentionMonths;
        if (!months) return false;
        const anchor = doc.publishedAt ?? doc.createdAt;
        const dueDate = new Date(anchor);
        dueDate.setMonth(dueDate.getMonth() + months);
        return dueDate < now;
      })
      .map((doc) => doc.id);

    if (expiredIds.length === 0) return;
    await this.repository.markExpired(tenantId, expiredIds);
    this.logger.log(`Expired ${expiredIds.length} document(s) for tenant ${tenantId}.`);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const document = await this.repository.findById(tenantId, id);
    if (!document) {
      throw new NotFoundAppError("OBJ-DOCUMENT", "Document not found.");
    }
    return document;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
