import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { CompanyRepository } from "./company.repository";
import type { CreateCompanyDto } from "./dto/create-company.dto";

/** v1 slice of docs/08-submodule-specifications/01-organization-management/01-company.md — see schema.prisma's Company comment for collapsed features. */
@Injectable()
export class CompanyService {
  constructor(
    private readonly repository: CompanyRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateCompanyDto) {
    const tenantId = this.requireTenantId();

    if (dto.parentCompanyId) {
      const parent = await this.repository.findById(tenantId, dto.parentCompanyId);
      if (!parent) {
        throw new NotFoundAppError("OBJ-COMPANY", "The parent company could not be found.");
      }
    }

    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-003",
          code: "ORG-003",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A company with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing company.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-COMPANY",
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
