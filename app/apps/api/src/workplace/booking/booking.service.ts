import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, ForbiddenAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { ResourceRepository } from "../resource/resource.repository";
import { BookingRepository } from "./booking.repository";
import type { CreateBookingDto } from "./dto/create-booking.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function stateConflict(message: string) {
  return new AppError({
    errorRef: "ERR-WORKPLACE-001",
    code: "WORKPLACE-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-WORKPLACE-BOOKING",
    details: {},
  });
}

/**
 * v1 slice — date-level capacity check only (no intraday time slots, no
 * waitlist). A booking is either Confirmed immediately or rejected outright
 * if the resource is already at capacity for that date.
 */
@Injectable()
export class BookingService {
  constructor(
    private readonly repository: BookingRepository,
    private readonly resourceRepository: ResourceRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateBookingDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const resource = await this.resourceRepository.findById(tenantId, dto.resourceId);
    if (!resource || !resource.isActive) {
      throw new ValidationAppError([{ field: "resourceId", code: "NOT_FOUND", message: "Resource not found or inactive." }]);
    }

    const bookingDate = new Date(dto.bookingDate);
    const existingCount = await this.repository.countConfirmedForResourceOnDate(tenantId, resource.id, bookingDate);
    if (existingCount >= resource.capacity) {
      throw stateConflict(`${resource.name} is fully booked for ${dto.bookingDate}.`);
    }

    return this.repository.create(tenantId, {
      resourceId: resource.id,
      employeeId: employee.id,
      bookingDate,
      notes: dto.notes,
    });
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** org_admin/hr_ops only — see controller's @Roles guard. */
  async listAll() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async cancel(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const booking = await this.repository.findById(tenantId, id);
    if (!booking) {
      throw new NotFoundAppError("OBJ-WORKPLACE-BOOKING", "Booking not found.");
    }
    const isAdmin = ADMIN_ROLES.some((role) => this.requestContext.roles.includes(role));
    if (!isAdmin && booking.employeeId !== employee.id) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const count = await this.repository.cancel(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Confirmed booking can be cancelled.");
    }
    return this.repository.findById(tenantId, id);
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
