import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { AppError } from "../../platform/errors/app-error";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateCheckInDto } from "./dto/create-checkin.dto";
import { CheckInRepository } from "./checkin.repository";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-CHECKIN-001",
    code: "CHECKIN-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-CHECKIN",
    details: { currentState },
  });
}

/**
 * Wave 3 W3·E11 Performance Management deepening — Check-ins / 1:1s
 * (docs/03-module-specifications/11-performance-management.md's check-ins
 * and 1:1-meetings catalog items, collapsed into one entity — see
 * schema.prisma's CheckIn comment). Manager schedules for a direct report;
 * both sides can add their own notes; the manager (or org_admin/hr_ops)
 * marks it complete or cancelled.
 */
@Injectable()
export class CheckInService {
  constructor(
    private readonly repository: CheckInRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateCheckInDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const isAdmin = ADMIN_ROLES.some((role) => this.requestContext.roles.includes(role));

    const target = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!target) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    if (!isAdmin && target.managerId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }

    return this.repository.create(tenantId, {
      employeeId: dto.employeeId,
      managerId: isAdmin ? (target.managerId ?? employee.id) : employee.id,
      scheduledDate: new Date(dto.scheduledDate),
      agenda: dto.agenda,
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForParticipant(tenantId, employee.id);
  }

  async addManagerNotes(id: string, notes: string) {
    const { tenantId } = await this.assertManagerOrAdmin(id);
    return this.repository.update(tenantId, id, { managerNotes: notes });
  }

  async addEmployeeNotes(id: string, notes: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const checkIn = await this.findOrThrow(tenantId, id);
    if (checkIn.employeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return this.repository.update(tenantId, id, { employeeNotes: notes });
  }

  async complete(id: string) {
    const { tenantId } = await this.assertManagerOrAdmin(id);
    const checkIn = await this.findOrThrow(tenantId, id);
    if (checkIn.status !== "Scheduled") {
      throw stateConflict("Only a Scheduled check-in can be completed.", checkIn.status);
    }
    return this.repository.update(tenantId, id, { status: "Completed", completedAt: new Date() });
  }

  async cancel(id: string) {
    const { tenantId } = await this.assertManagerOrAdmin(id);
    const checkIn = await this.findOrThrow(tenantId, id);
    if (checkIn.status !== "Scheduled") {
      throw stateConflict("Only a Scheduled check-in can be cancelled.", checkIn.status);
    }
    return this.repository.update(tenantId, id, { status: "Cancelled" });
  }

  private async assertManagerOrAdmin(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const isAdmin = ADMIN_ROLES.some((role) => this.requestContext.roles.includes(role));
    const checkIn = await this.findOrThrow(tenantId, id);
    if (!isAdmin && checkIn.managerId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return { tenantId, employee };
  }

  private async findOrThrow(tenantId: string, id: string) {
    const checkIn = await this.repository.findById(tenantId, id);
    if (!checkIn) {
      throw new NotFoundAppError("OBJ-CHECKIN", "Check-in not found.");
    }
    return checkIn;
  }
}
