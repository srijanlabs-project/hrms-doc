import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { NotFoundAppError, TenantBoundaryError } from "../../platform/errors/errors";
import { AddCalendarDayDto } from "./dto/add-calendar-day.dto";
import { AssignCalendarDto } from "./dto/assign-calendar.dto";
import { CreateWorkCalendarDto } from "./dto/create-work-calendar.dto";
import { WorkCalendarRepository } from "./work-calendar.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ORG-012",
    code: "ORG-012",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-WORK-CALENDAR",
    details: { currentState },
  });
}

/**
 * v1 slice of docs/08-submodule-specifications/01-organization-management/09-work-calendar.md.
 * Holiday calendar folds in as WorkCalendarDay rows with dayType=Holiday.
 * Collapses the 5-state model to Draft/Published/Retired.
 */
@Injectable()
export class WorkCalendarService {
  constructor(
    private readonly repository: WorkCalendarRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    return this.repository.findAll(this.requireTenantId());
  }

  async create(dto: CreateWorkCalendarDto) {
    const tenantId = this.requireTenantId();
    try {
      return await this.repository.create(tenantId, dto);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new AppError({
          errorRef: "ERR-ORG-013",
          code: "ORG-013",
          category: "state-conflict",
          severity: "medium",
          httpStatus: 409,
          message: `A work calendar with code "${dto.code}" already exists.`,
          userAction: "Use a different code, or edit the existing calendar.",
          retryable: false,
          tenantSafe: true,
          objectRef: "OBJ-WORK-CALENDAR",
        });
      }
      throw err;
    }
  }

  async publish(id: string) {
    const tenantId = this.requireTenantId();
    const calendar = await this.repository.findById(tenantId, id);
    if (!calendar) {
      throw new NotFoundAppError("OBJ-WORK-CALENDAR", "Work calendar not found.");
    }
    if (calendar.status !== "Draft") {
      throw stateConflict(`Only a Draft calendar can be published (current: ${calendar.status}).`, calendar.status);
    }
    return this.repository.publish(tenantId, id);
  }

  async addDay(calendarId: string, dto: AddCalendarDayDto) {
    const tenantId = this.requireTenantId();
    const calendar = await this.repository.findById(tenantId, calendarId);
    if (!calendar) {
      throw new NotFoundAppError("OBJ-WORK-CALENDAR", "Work calendar not found.");
    }
    return this.repository.addDay(tenantId, calendarId, dto);
  }

  async assign(calendarId: string, dto: AssignCalendarDto) {
    const tenantId = this.requireTenantId();
    const calendar = await this.repository.findById(tenantId, calendarId);
    if (!calendar) {
      throw new NotFoundAppError("OBJ-WORK-CALENDAR", "Work calendar not found.");
    }
    return this.repository.assign(tenantId, calendarId, dto);
  }

  async listAssignments() {
    return this.repository.findAssignments(this.requireTenantId());
  }

  private requireTenantId(): string {
    const tenantId = this.requestContext.tenantId;
    if (!tenantId) {
      throw new TenantBoundaryError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
