import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateEsopGrantDto } from "./dto/create-esop-grant.dto";
import type { EsopGrantWithEmployee } from "./esop.repository";
import { EsopRepository } from "./esop.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ESOP-001",
    code: "ESOP-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ESOP-GRANT",
    details: { currentState },
  });
}

/** Standard monthly-linear vesting with a cliff: 0 units before the cliff, then linear to totalUnits over vestingYears. */
function computeVestedUnits(grant: { totalUnits: number; vestingStartDate: Date; vestingYears: number; cliffMonths: number }, asOf: Date): number {
  const monthsElapsed =
    (asOf.getUTCFullYear() - grant.vestingStartDate.getUTCFullYear()) * 12 + (asOf.getUTCMonth() - grant.vestingStartDate.getUTCMonth());
  if (monthsElapsed < grant.cliffMonths) return 0;
  const totalMonths = grant.vestingYears * 12;
  const vestedRatio = Math.min(1, monthsElapsed / totalMonths);
  return Math.floor(grant.totalUnits * vestedRatio);
}

export interface EsopGrantWithVesting extends EsopGrantWithEmployee {
  vestedUnits: number;
}

/**
 * Wave 3 E14 gap closure ("ESOPs") — grant + vesting-schedule tracking only.
 * Vested units are always computed live, never stored (see schema.prisma's
 * EsopGrant comment). No exercise/transaction ledger — that needs a
 * cap-table/finance-system integration this build doesn't have.
 */
@Injectable()
export class EsopService {
  constructor(
    private readonly repository: EsopRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateEsopGrantDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const grant = await this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      totalUnits: dto.totalUnits,
      grantDate: new Date(dto.grantDate),
      vestingStartDate: new Date(dto.vestingStartDate),
      vestingYears: dto.vestingYears,
      cliffMonths: dto.cliffMonths,
      exercisePrice: dto.exercisePrice,
      createdByUserId: userId,
    });
    return this.withVesting(grant);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const grants = await this.repository.findForEmployee(tenantId, employee.id);
    return grants.map((g) => this.withVesting(g));
  }

  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    const grants = await this.repository.findAll(tenantId);
    return grants.map((g) => this.withVesting(g));
  }

  async cancel(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const grant = await this.findOrThrow(tenantId, id);
    if (grant.status !== "Active") {
      throw stateConflict("Only an Active grant can be cancelled.", grant.status);
    }
    const cancelled = await this.repository.cancel(tenantId, id);
    return this.withVesting({ ...grant, ...cancelled });
  }

  private withVesting(grant: EsopGrantWithEmployee): EsopGrantWithVesting {
    return { ...grant, vestedUnits: computeVestedUnits(grant, new Date()) };
  }

  private async findOrThrow(tenantId: string, id: string) {
    const grant = await this.repository.findById(tenantId, id);
    if (!grant) {
      throw new NotFoundAppError("OBJ-ESOP-GRANT", "ESOP grant not found.");
    }
    return grant;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
