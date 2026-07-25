import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { TenantBoundaryError } from "../../platform/errors/errors";
import { CreateJobFamilyDto } from "./dto/create-job-family.dto";
import { JobFamilyRepository } from "./job-family.repository";

/** Flat reference catalog — no dedicated deep spec, part of the Wave 1 Org Management deepening. */
@Injectable()
export class JobFamilyService {
  constructor(
    private readonly repository: JobFamilyRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateJobFamilyDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-007",
          code: "ORG-007",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A job family with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing job family.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-JOB-FAMILY",
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
