import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { RosterRepository } from "../roster/roster.repository";
import type { AssignRotationDto } from "./dto/assign-rotation.dto";
import type { CreatePatternDto } from "./dto/create-pattern.dto";
import type { GenerateRosterDto } from "./dto/generate-roster.dto";
import { RotationRepository } from "./rotation.repository";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

function toUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function mondayOf(date: Date): Date {
  const daysSinceMonday = (date.getUTCDay() + 6) % 7;
  const monday = new Date(date);
  monday.setUTCDate(monday.getUTCDate() - daysSinceMonday);
  return monday;
}

function patternNameConflict(name: string) {
  return new AppError({
    errorRef: "ERR-ROTATION-001",
    code: "ROTATION-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message: `A rotation pattern named "${name}" already exists.`,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-SHIFT-ROTATION-PATTERN",
    details: { name },
  });
}

/**
 * v1 slice closing Workforce Management's "shift rotation" gap (E07) —
 * ShiftDefinition's own v1 comment named this as deferred ("no rotation
 * patterns"). A pattern is an ordered weekly cycle of shifts; generateRoster()
 * materializes real RosterEntry rows for a date range via
 * RosterRepository.upsertEntry — reused exactly, no parallel roster-writing path.
 */
@Injectable()
export class RotationService {
  constructor(
    private readonly repository: RotationRepository,
    private readonly rosterRepository: RosterRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async createPattern(dto: CreatePatternDto) {
    const { tenantId } = this.requireAuthenticated();
    const existing = await this.repository.findPatternByName(tenantId, dto.name);
    if (existing) {
      throw patternNameConflict(dto.name);
    }
    return this.repository.createPattern(tenantId, dto.name, dto.shiftIds);
  }

  async listPatterns() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listPatterns(tenantId);
  }

  async assign(dto: AssignRotationDto) {
    const { tenantId } = this.requireAuthenticated();
    const anchorWeekStart = toUtcDate(dto.anchorWeekStart);
    if (anchorWeekStart.getUTCDay() !== 1) {
      throw new ValidationAppError([
        { field: "anchorWeekStart", code: "NOT_MONDAY", message: "anchorWeekStart must be a Monday." },
      ]);
    }
    const pattern = await this.repository.findPatternById(tenantId, dto.patternId);
    if (!pattern) {
      throw new NotFoundAppError("OBJ-SHIFT-ROTATION-PATTERN", "Rotation pattern not found.");
    }
    return this.repository.assign(tenantId, {
      employeeId: dto.employeeId,
      patternId: dto.patternId,
      anchorWeekStart,
      effectiveFrom: anchorWeekStart,
    });
  }

  /** Materializes Draft RosterEntry rows for the range from the employee's active rotation assignment. */
  async generateRoster(dto: GenerateRosterDto) {
    const { tenantId } = this.requireAuthenticated();
    const assignment = await this.repository.findActiveForEmployee(tenantId, dto.employeeId);
    if (!assignment) {
      throw new NotFoundAppError("OBJ-EMPLOYEE-ROTATION-ASSIGNMENT", "Employee has no active rotation assignment.");
    }
    const { steps, cadenceWeeks } = assignment.pattern;
    const fromDate = toUtcDate(dto.from);
    const toDate = toUtcDate(dto.to);

    let generatedCount = 0;
    for (let d = new Date(fromDate); d <= toDate; d.setUTCDate(d.getUTCDate() + 1)) {
      const weeksSinceAnchor = Math.floor((mondayOf(d).getTime() - assignment.anchorWeekStart.getTime()) / MS_PER_WEEK);
      const weekIndex = ((weeksSinceAnchor % cadenceWeeks) + cadenceWeeks) % cadenceWeeks;
      const step = steps.find((s) => s.weekIndex === weekIndex);
      if (!step) continue;
      await this.rosterRepository.upsertEntry(tenantId, { employeeId: dto.employeeId, shiftId: step.shiftId, date: new Date(d) });
      generatedCount += 1;
    }
    return { generatedCount };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
