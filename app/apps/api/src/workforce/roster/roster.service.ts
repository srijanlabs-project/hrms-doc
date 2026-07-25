import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { ShiftService } from "../shift/shift.service";
import type { RequestSwapDto } from "./dto/request-swap.dto";
import type { UpsertRosterEntryDto } from "./dto/upsert-roster-entry.dto";
import { RosterRepository } from "./roster.repository";

type SwapDecision = "Approved" | "Rejected";

function toUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-ROSTER-001",
    code: "ROSTER-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ROSTER-SWAP",
  });
}

/**
 * v1 slice consolidating docs/08-submodule-specifications/07-workforce-management/
 * 04-rostering.md and 07-workforce-scheduling.md (near-duplicate specs) into one
 * per-date roster entry with Draft/Published status plus a swap-request flow.
 * Coverage rules, skill/certification constraints, and demand forecasting are
 * deferred — no staffing-rules or forecasting engine exists. Swap approval
 * mirrors LeaveRequestService's assigned-manager-or-admin-override pattern
 * (no delegation wiring for this one — the pattern is already proven 3x
 * elsewhere in this build).
 */
@Injectable()
export class RosterService {
  constructor(
    private readonly repository: RosterRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly shiftService: ShiftService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async upsertEntry(dto: UpsertRosterEntryDto) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.upsertEntry(tenantId, {
      employeeId: dto.employeeId,
      shiftId: dto.shiftId,
      date: toUtcDate(dto.date),
    });
  }

  async publish(from: string, to: string) {
    const { tenantId } = this.requireAuthenticated();
    const count = await this.repository.publishRange(tenantId, toUtcDate(from), toUtcDate(to));
    return { publishedCount: count };
  }

  async listForRange(from: string, to: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findForRange(tenantId, toUtcDate(from), toUtcDate(to));
  }

  /** Explicit roster entries for the range, falling back to the employee's standing shift where no entry exists. */
  async myRoster(from: string, to: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const fromDate = toUtcDate(from);
    const toDate = toUtcDate(to);
    const entries = await this.repository.findForEmployeeRange(tenantId, employee.id, fromDate, toDate);
    const byDate = new Map(entries.map((e) => [e.date.toISOString().slice(0, 10), e]));

    const defaultShift = await this.shiftService.effectiveShiftForEmployee(tenantId, employee.id);

    const days: Array<{
      entryId: string | null;
      date: string;
      shiftId: string | null;
      shiftName: string | null;
      status: string;
      source: "Roster" | "Default" | "Unassigned";
    }> = [];
    for (let d = new Date(fromDate); d <= toDate; d.setUTCDate(d.getUTCDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const entry = byDate.get(key);
      if (entry) {
        days.push({ entryId: entry.id, date: key, shiftId: entry.shiftId, shiftName: entry.shift.name, status: entry.status, source: "Roster" });
      } else if (defaultShift) {
        days.push({ entryId: null, date: key, shiftId: defaultShift.id, shiftName: defaultShift.name, status: "Published", source: "Default" });
      } else {
        days.push({ entryId: null, date: key, shiftId: null, shiftName: null, status: "Unassigned", source: "Unassigned" });
      }
    }
    return days;
  }

  async requestSwap(rosterEntryId: string, dto: RequestSwapDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const entry = await this.repository.findEntryById(tenantId, rosterEntryId);
    if (!entry) {
      throw new NotFoundAppError("OBJ-ROSTER-ENTRY", "Roster entry not found.");
    }
    if (entry.employeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    if (entry.status !== "Published") {
      throw stateConflict("Only a published roster entry can be swapped.");
    }
    if (dto.counterpartEmployeeId === employee.id) {
      throw new ValidationAppError([
        { field: "counterpartEmployeeId", code: "SELF_SWAP", message: "You cannot swap with yourself." },
      ]);
    }
    const counterpart = await this.employeeRepository.findById(tenantId, dto.counterpartEmployeeId);
    if (!counterpart) {
      throw new ValidationAppError([
        { field: "counterpartEmployeeId", code: "NOT_FOUND", message: "Counterpart employee not found." },
      ]);
    }
    return this.repository.createSwapRequest(tenantId, {
      rosterEntryId,
      requestedByEmployeeId: employee.id,
      counterpartEmployeeId: dto.counterpartEmployeeId,
      reason: dto.reason,
    });
  }

  async listMySwaps() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findSwapsForEmployee(tenantId, employee.id);
  }

  async listSwapsForApproval() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const reports = await this.employeeRepository.findByManagerId(tenantId, employee.id);
    return this.repository.findPendingSwapsForRequesters(tenantId, reports.map((r) => r.id));
  }

  async decideSwap(id: string, decision: SwapDecision, note?: string) {
    const { tenantId, userId } = this.requireAuthenticated();
    const swap = await this.repository.findSwapById(tenantId, id);
    if (!swap) {
      throw new NotFoundAppError("OBJ-ROSTER-SWAP", "Swap request not found.");
    }
    if (swap.status !== "Pending") {
      throw stateConflict(`This swap request is already ${swap.status.toLowerCase()}.`);
    }

    const requester = await this.employeeRepository.findById(tenantId, swap.requestedByEmployeeId);
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isAssignedApprover = !!requester?.managerId && !!user?.employeeId && user.employeeId === requester.managerId;
    const isAdminOverride = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isAssignedApprover && !isAdminOverride) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    await this.repository.decideSwap(tenantId, id, { status: decision, decisionNote: note, decidedByUserId: userId });
    if (decision === "Approved") {
      await this.repository.reassignEntry(tenantId, swap.rosterEntryId, swap.counterpartEmployeeId);
    }
    return this.repository.findSwapById(tenantId, id);
  }

  async withdrawSwap(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const count = await this.repository.withdrawSwap(tenantId, id, employee.id);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-ROSTER-SWAP", "Swap request not found, not yours, or no longer pending.");
    }
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
