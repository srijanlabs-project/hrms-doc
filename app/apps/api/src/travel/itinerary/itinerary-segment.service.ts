import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import { TravelRequestRepository } from "../travel-request.repository";
import type { CreateItinerarySegmentDto } from "./dto/create-itinerary-segment.dto";
import { ItinerarySegmentRepository } from "./itinerary-segment.repository";

/**
 * Wave 3 W4·E16 gap closure ("trip planning" + "itinerary") — leg-by-leg
 * itinerary building on a travel request. See schema.prisma's
 * TravelItinerarySegment comment: planning a trip IS building its itinerary.
 */
@Injectable()
export class ItinerarySegmentService {
  constructor(
    private readonly repository: ItinerarySegmentRepository,
    private readonly travelRequestRepository: TravelRequestRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async addSegment(travelRequestId: string, dto: CreateItinerarySegmentDto) {
    const { tenantId } = await this.requireOwned(travelRequestId);
    return this.repository.create(tenantId, {
      travelRequestId,
      sequence: dto.sequence,
      mode: dto.mode,
      fromLocation: dto.fromLocation,
      toLocation: dto.toLocation,
      departAt: new Date(dto.departAt),
      arriveAt: dto.arriveAt ? new Date(dto.arriveAt) : undefined,
      bookingReference: dto.bookingReference,
      notes: dto.notes,
    });
  }

  async listForTravelRequest(travelRequestId: string) {
    const { tenantId } = await this.requireOwned(travelRequestId);
    return this.repository.findForTravelRequest(tenantId, travelRequestId);
  }

  async removeSegment(travelRequestId: string, segmentId: string) {
    const { tenantId } = await this.requireOwned(travelRequestId);
    const count = await this.repository.delete(tenantId, segmentId);
    if (count === 0) {
      throw new NotFoundAppError("OBJ-TRAVEL-ITINERARY-SEGMENT", "Itinerary segment not found.");
    }
  }

  private async requireOwned(travelRequestId: string): Promise<{ tenantId: string }> {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const request = await this.travelRequestRepository.findById(tenantId, travelRequestId);
    if (!request) {
      throw new NotFoundAppError("OBJ-TRAVEL-REQUEST", "Travel request not found.");
    }
    const isOwner = request.employeeId === employee.id;
    if (!isOwner) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
