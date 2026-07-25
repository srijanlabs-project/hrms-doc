import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { CreateSlaPolicyDto } from "./dto/create-sla-policy.dto";
import { SlaPolicyRepository } from "./sla-policy.repository";

/** org_admin/hr_ops only — see controller's @Roles guard. */
@Injectable()
export class SlaPolicyService {
  constructor(
    private readonly repository: SlaPolicyRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async upsert(dto: CreateSlaPolicyDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.upsert(tenantId, dto);
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
