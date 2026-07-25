import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError } from "../../platform/errors/errors";
import type { AssignShiftDto } from "./dto/assign-shift.dto";
import type { CreateShiftDto } from "./dto/create-shift.dto";
import { ShiftRepository } from "./shift.repository";

function shiftCodeConflict(code: string) {
  return new AppError({
    errorRef: "ERR-SHIFT-001",
    code: "SHIFT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message: `A shift with code "${code}" already exists.`,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SHIFT-DEFINITION",
    details: { code },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/07-workforce-management/03-shift-management.md.
 * No Draft/Published/Superseded version state machine (edits apply immediately,
 * no shift_version history table), no rotation patterns, no break-rule detail,
 * no multi-segment split shifts, no eligibility-rule engine. Real, buildable
 * core kept: shift templates, effective-dated assignment with automatic
 * closure of the prior assignment, and resolving "what shift is this employee
 * on today" — the fact RosterEntry and future attendance work need.
 */
@Injectable()
export class ShiftService {
  constructor(
    private readonly repository: ShiftRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createShift(dto: CreateShiftDto) {
    const { tenantId } = this.requireAuthenticated();
    const existing = await this.repository.findShiftByCode(tenantId, dto.code);
    if (existing) {
      throw shiftCodeConflict(dto.code);
    }
    return this.repository.createShift(tenantId, {
      code: dto.code,
      name: dto.name,
      startTime: dto.startTime,
      endTime: dto.endTime,
      crossMidnight: dto.crossMidnight ?? false,
      plannedMinutes: dto.plannedMinutes,
      graceMinutes: dto.graceMinutes ?? 0,
    });
  }

  async listShifts() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listShifts(tenantId);
  }

  async assign(dto: AssignShiftDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.assign(tenantId, {
      employeeId: dto.employeeId,
      shiftId: dto.shiftId,
      effectiveFrom: new Date(`${dto.effectiveFrom}T00:00:00.000Z`),
    });
  }

  async myShift() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findActiveForEmployee(tenantId, employee.id);
  }

  async listAllActive() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAllActive(tenantId);
  }

  /** Used by RosterService to fall back to the standing shift when no date-specific roster entry exists. */
  async effectiveShiftForEmployee(tenantId: string, employeeId: string) {
    const assignment = await this.repository.findActiveForEmployee(tenantId, employeeId);
    return assignment?.shift ?? null;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
