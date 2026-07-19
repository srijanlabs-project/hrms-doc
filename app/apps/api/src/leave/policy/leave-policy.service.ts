import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import type { CreateLeavePolicyDto } from "./dto/create-leave-policy.dto";
import { LeavePolicyRepository } from "./leave-policy.repository";

@Injectable()
export class LeavePolicyService {
  constructor(
    private readonly repository: LeavePolicyRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateLeavePolicyDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-LEAVE-001",
          code: "LEAVE-001",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A leave policy for type "${dto.leaveType}" already exists.`,
          userAction: "Edit the existing policy instead.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-LEAVE-POLICY",
        });
      }
      throw err;
    }
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
