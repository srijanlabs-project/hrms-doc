import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { AssignFlexPolicyDto } from "./dto/assign-flex-policy.dto";
import type { CreateFlexPolicyDto } from "./dto/create-flex-policy.dto";
import { FlexRepository } from "./flex.repository";

function policyNameConflict(name: string) {
  return new AppError({
    errorRef: "ERR-FLEX-001",
    code: "FLEX-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message: `A flexible hours policy named "${name}" already exists.`,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-FLEXIBLE-HOURS-POLICY",
    details: { name },
  });
}

/**
 * v1 slice closing Workforce Management's "flexible hours" gap (E07). Mirrors
 * ShiftService's catalog-plus-standing-assignment shape exactly. Compliance
 * evaluation (see flex-compliance.ts) runs inside AttendanceService.mark()
 * against self-reported check-in/check-out times — no punch-clock capture
 * exists in this build, so this stays informational, not payroll-integrated.
 */
@Injectable()
export class FlexService {
  constructor(
    private readonly repository: FlexRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createPolicy(dto: CreateFlexPolicyDto) {
    const { tenantId } = this.requireAuthenticated();
    const existing = await this.repository.findPolicyByName(tenantId, dto.name);
    if (existing) {
      throw policyNameConflict(dto.name);
    }
    return this.repository.createPolicy(tenantId, dto);
  }

  async listPolicies() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listPolicies(tenantId);
  }

  async assign(dto: AssignFlexPolicyDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.assign(tenantId, {
      employeeId: dto.employeeId,
      policyId: dto.policyId,
      effectiveFrom: new Date(`${dto.effectiveFrom}T00:00:00.000Z`),
    });
  }

  async myPolicy() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findActiveForEmployee(tenantId, employee.id);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
