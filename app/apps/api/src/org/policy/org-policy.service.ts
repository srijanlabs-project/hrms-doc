import { Injectable } from "@nestjs/common";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { CreateOrgPolicyDto } from "./dto/create-org-policy.dto";
import { OrgPolicyRepository } from "./org-policy.repository";

/** No dedicated spec file — minimal policy-document registry, not a rules/versioning/acknowledgment engine. */
@Injectable()
export class OrgPolicyService {
  constructor(
    private readonly repository: OrgPolicyRepository,
    private readonly requestContext: RequestContextService,
    private readonly audit: AuditService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateOrgPolicyDto) {
    return this.repository.create(this.requireTenantId(), dto);
  }

  async archive(id: string) {
    const tenantId = this.requireTenantId();
    const policy = await this.repository.findById(tenantId, id);
    if (!policy) {
      throw new NotFoundAppError("OBJ-ORG-POLICY", "Policy not found.");
    }
    const archived = await this.repository.archive(tenantId, id);
    await this.audit.record({
      entityType: "OrgPolicy",
      entityId: id,
      action: "OrgPolicy.archive",
      before: { status: policy.status },
      after: { status: "Archived" },
    });
    return archived;
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
