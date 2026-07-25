import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../context/request-context.service";
import { AuthenticationAppError } from "../errors/errors";
import { AuditLogRepository, type CreateAuditLogInput } from "./audit-log.repository";

/**
 * Audit Engine (Foundation & Platform, E00). record() is the write side any
 * module calls after a significant state change with no history table of its
 * own — see SalaryRevisionService.apply(), OrgPolicyService.archive(), and
 * EmployeeService.separate() for the first consumers. listRecent()/
 * listForEntity() back the admin-facing viewer. Modules that already keep a
 * rich domain history (EmployeeAssignmentHistory, ProbationRecord) don't need
 * this — it exists for the mutations that had no trail at all.
 */
@Injectable()
export class AuditService {
  constructor(
    private readonly repository: AuditLogRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async record(input: Omit<CreateAuditLogInput, "actorUserId"> & { actorUserId?: string }): Promise<void> {
    const tenantId = this.requestContext.tenantId;
    const actorUserId = input.actorUserId ?? this.requestContext.userId;
    if (!tenantId || !actorUserId) {
      return;
    }
    await this.repository.create(tenantId, { ...input, actorUserId });
  }

  async listRecent() {
    const tenantId = this.requireTenantId();
    return this.repository.findRecent(tenantId);
  }

  async listForEntity(entityType: string, entityId: string) {
    const tenantId = this.requireTenantId();
    return this.repository.findForEntity(tenantId, entityType, entityId);
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
