import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import type { CreateEventDto } from "./dto/create-event.dto";
import type { RsvpEventDto } from "./dto/rsvp-event.dto";
import { EventRepository } from "./event.repository";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-EXPERIENCE-EVENT-001",
    code: "EXPERIENCE-EVENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-EXPERIENCE-EVENT",
    details: { currentState },
  });
}

/** Wave 4 W4·E15 gap closure ("events") — company/team events with RSVP. */
@Injectable()
export class EventService {
  constructor(
    private readonly repository: EventRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async create(dto: CreateEventDto) {
    const { tenantId, userId } = this.requireAuthenticated();
    return this.repository.create(tenantId, {
      title: dto.title,
      description: dto.description,
      location: dto.location,
      startAt: new Date(dto.startAt),
      createdByUserId: userId,
    });
  }

  async listPublishedUpcoming() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findPublishedUpcoming(tenantId);
  }

  async listAllAdmin() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAllAdmin(tenantId);
  }

  async publish(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const event = await this.findOrThrow(tenantId, id);
    const count = await this.repository.publish(tenantId, id);
    if (count === 0) {
      throw stateConflict("Only a Draft event can be published.", event.status);
    }
    return this.repository.findById(tenantId, id);
  }

  async rsvp(eventId: string, dto: RsvpEventDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    await this.findOrThrow(tenantId, eventId);
    return this.repository.upsertRsvp(tenantId, eventId, employee.id, dto.response);
  }

  async myRsvp(eventId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findMyRsvp(tenantId, eventId, employee.id);
  }

  private async findOrThrow(tenantId: string, id: string) {
    const event = await this.repository.findById(tenantId, id);
    if (!event) {
      throw new NotFoundAppError("OBJ-EXPERIENCE-EVENT", "Event not found.");
    }
    return event;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
