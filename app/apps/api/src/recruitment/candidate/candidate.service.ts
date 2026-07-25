import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError } from "../../platform/errors/errors";
import { CandidateRepository } from "./candidate.repository";
import type { CreateCandidateDto } from "./dto/create-candidate.dto";

/** v1: contact info + a simplified source tag only — no resume storage, duplicate detection, or candidate portal (see schema.prisma's Candidate comment). */
@Injectable()
export class CandidateService {
  constructor(
    private readonly repository: CandidateRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async create(dto: CreateCandidateDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.create(tenantId, {
        fullName: dto.fullName,
        email: dto.email,
        source: dto.source ?? "Direct",
      });
    } catch {
      throw new AppError({
        errorRef: "ERR-CANDIDATE-001",
        code: "CANDIDATE-001",
        category: "state-conflict",
        severity: "medium",
        httpStatus: 409,
        message: `A candidate with email "${dto.email}" already exists.`,
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-CANDIDATE",
      });
    }
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
