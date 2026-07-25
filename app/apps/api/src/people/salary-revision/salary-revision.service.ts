import { Injectable } from "@nestjs/common";
import { ArrearService } from "../../payroll/arrear/arrear.service";
import { CompensationRepository } from "../../payroll/compensation/compensation.repository";
import { AuditService } from "../../platform/audit/audit.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import { CreateSalaryRevisionDto } from "./dto/create-salary-revision.dto";
import { SalaryRevisionRepository } from "./salary-revision.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PEOPLE-004",
    code: "PEOPLE-004",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SALARY-REVISION",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/02-people-management/12-salary-revision.md:
 * a standalone, ad-hoc individual pay change — distinct from
 * CompensationReviewCycle/Item (Phase 7's annual merit-cycle mechanism).
 * Proposed -> Approved -> Applied/Rejected only. Applying writes straight
 * through to EmployeeCompensation via CompensationRepository, the exact same
 * pattern as ItemService.apply().
 */
@Injectable()
export class SalaryRevisionService {
  constructor(
    private readonly repository: SalaryRevisionRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly compensationRepository: CompensationRepository,
    private readonly arrearService: ArrearService,
    private readonly requestContext: RequestContextService,
    private readonly audit: AuditService,
  ) {}

  async listForEmployee(employeeId: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForEmployee(tenantId, employeeId);
  }

  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async propose(employeeId: string, dto: CreateSalaryRevisionDto) {
    const { tenantId } = this.requireAuthenticated();
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const currentComp = await this.compensationRepository.findByEmployeeId(tenantId, employeeId);
    return this.repository.create(tenantId, {
      employeeId,
      previousMonthlyBasic: currentComp?.monthlyBasic ?? 0,
      proposedMonthlyBasic: dto.proposedMonthlyBasic,
      effectiveDate: new Date(dto.effectiveDate),
      reason: dto.reason,
    });
  }

  async approve(id: string, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const revision = await this.findOrThrow(tenantId, id);
    if (revision.status !== "Proposed") {
      throw stateConflict("Only a Proposed revision can be approved.", revision.status);
    }
    return this.repository.approve(tenantId, id, userId, note);
  }

  async reject(id: string, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const revision = await this.findOrThrow(tenantId, id);
    if (revision.status !== "Proposed") {
      throw stateConflict("Only a Proposed revision can be rejected.", revision.status);
    }
    return this.repository.reject(tenantId, id, userId, note);
  }

  async apply(id: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const revision = await this.findOrThrow(tenantId, id);
    if (revision.status !== "Approved") {
      throw stateConflict("Only an Approved revision can be applied.", revision.status);
    }
    await this.compensationRepository.upsert(tenantId, revision.employeeId, {
      monthlyBasic: revision.proposedMonthlyBasic,
      effectiveFrom: revision.effectiveDate,
    });
    const applied = await this.repository.apply(tenantId, id);
    await this.audit.record({
      entityType: "EmployeeCompensation",
      entityId: revision.employeeId,
      action: "SalaryRevision.apply",
      before: { monthlyBasic: revision.previousMonthlyBasic },
      after: { monthlyBasic: revision.proposedMonthlyBasic, effectiveDate: revision.effectiveDate },
    });
    // 04-arrears-and-retro-pay.md: if effectiveDate falls inside an already-paid period, owe the delta as an arrear.
    await this.arrearService.createFromSalaryRevision(tenantId, applied, userId);
    return applied;
  }

  private async findOrThrow(tenantId: string, id: string) {
    const revision = await this.repository.findById(tenantId, id);
    if (!revision) {
      throw new NotFoundAppError("OBJ-SALARY-REVISION", "Salary revision not found.");
    }
    return revision;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
