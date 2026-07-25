import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { CreateJobFunctionDto } from "./dto/create-job-function.dto";
import { JobFunctionRepository } from "./job-function.repository";

@Injectable()
export class JobFunctionService {
  constructor(
    private readonly repository: JobFunctionRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateJobFunctionDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-008",
          code: "ORG-008",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A job function with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing job function.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-JOB-FUNCTION",
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
