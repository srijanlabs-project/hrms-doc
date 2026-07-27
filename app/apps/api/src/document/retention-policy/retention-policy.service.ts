import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { RetentionPolicyRepository } from "./retention-policy.repository";

/** org_admin/hr_ops only end to end — see controller's class-level @Roles guard. */
@Injectable()
export class RetentionPolicyService {
  constructor(
    private readonly repository: RetentionPolicyRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateRetentionPolicyDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      name: dto.name,
      category: dto.category ?? "All",
      retentionMonths: dto.retentionMonths,
    });
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
