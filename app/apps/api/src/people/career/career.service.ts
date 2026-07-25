import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { EmployeeRepository } from "../employee/employee.repository";
import { CareerRepository } from "./career.repository";
import type { CreateContractRenewalDto } from "./dto/create-contract-renewal.dto";
import type { CreateEmployeeDocumentDto } from "./dto/create-employee-document.dto";
import type { CreateMovementDto } from "./dto/create-movement.dto";
import type { CreateProbationDto } from "./dto/create-probation.dto";
import type { DecideProbationDto } from "./dto/decide-probation.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-PEOPLE-003",
    code: "PEOPLE-003",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-PROBATION",
    details: { currentState },
  });
}

/**
 * v1 slice consolidating 3 catalog items — employment information (the
 * effective-dated assignment history deferred back in Phase 2),
 * promotion/demotion/transfer, and deputation/secondment — into one
 * append-only, type-tagged movement ledger that also applies the change
 * directly to the live Employee record. Plus probation/confirmation,
 * contract renewal, and employee documents (docs/.../10, no dedicated spec
 * for contract renewal, 14-employee-documents.md).
 */
@Injectable()
export class CareerService {
  constructor(
    private readonly repository: CareerRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getAll(employeeId: string) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.findAll(tenantId, employeeId);
  }

  /** Admin-only: recording a movement is an HR action, not self-service. */
  async createMovement(employeeId: string, dto: CreateMovementDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }

    const history = await this.repository.createAssignmentHistory(tenantId, {
      employeeId,
      changeType: dto.changeType,
      effectiveDate: new Date(dto.effectiveDate),
      fromDepartmentId: employee.departmentId,
      toDepartmentId: dto.toDepartmentId ?? employee.departmentId,
      fromManagerId: employee.managerId,
      toManagerId: dto.toManagerId ?? employee.managerId,
      fromDesignationId: employee.designationId,
      toDesignationId: dto.toDesignationId ?? employee.designationId,
      fromGradeId: employee.gradeId,
      toGradeId: dto.toGradeId ?? employee.gradeId,
      reason: dto.reason,
      createdByUserId: userId,
    });

    await this.employeeRepository.applyAssignmentChange(tenantId, employeeId, {
      departmentId: dto.toDepartmentId ?? employee.departmentId ?? undefined,
      managerId: dto.toManagerId ?? employee.managerId ?? undefined,
      designationId: dto.toDesignationId ?? employee.designationId ?? undefined,
      gradeId: dto.toGradeId ?? employee.gradeId ?? undefined,
    });

    return history;
  }

  async createProbation(employeeId: string, dto: CreateProbationDto) {
    const { tenantId } = this.requireAuthenticated();
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    return this.repository.createProbation(tenantId, employeeId, dto);
  }

  async decideProbation(id: string, dto: DecideProbationDto) {
    const { tenantId } = this.requireAuthenticated();
    const record = await this.repository.findProbationById(tenantId, id);
    if (!record) {
      throw new NotFoundAppError("OBJ-PROBATION", "Probation record not found.");
    }
    if (record.status !== "OnProbation" && record.status !== "Extended") {
      throw stateConflict(`This probation record is already ${record.status}.`, record.status);
    }
    const status = dto.decision;
    return this.repository.decideProbation(tenantId, id, {
      status,
      decisionNote: dto.decisionNote,
      extendedUntil: dto.extendedUntil ? new Date(dto.extendedUntil) : undefined,
    });
  }

  async createContractRenewal(employeeId: string, dto: CreateContractRenewalDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const renewal = await this.repository.createContractRenewal(
      tenantId,
      employeeId,
      employee.contractEndDate,
      dto,
      userId,
    );
    await this.employeeRepository.updateContractEndDate(tenantId, employeeId, new Date(dto.newEndDate));
    return renewal;
  }

  async addDocument(employeeId: string, dto: CreateEmployeeDocumentDto) {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    return this.repository.createDocument(tenantId, employeeId, dto);
  }

  /** Actual org_admin/hr_ops gating happens via @Roles on the controller routes that call these methods. */
  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }

  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
