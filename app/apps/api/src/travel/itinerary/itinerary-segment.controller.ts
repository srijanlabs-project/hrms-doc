import { Body, Controller, Delete, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateItinerarySegmentDto } from "./dto/create-itinerary-segment.dto";
import { ItinerarySegmentService } from "./itinerary-segment.service";

/** HTTP only — no business logic. Wave 3 W4·E16 gap closure: trip planning + itinerary. */
@Controller("travel/requests/:travelRequestId/itinerary")
export class ItinerarySegmentController {
  constructor(private readonly service: ItinerarySegmentService) {}

  @Get()
  async listForTravelRequest(@Param("travelRequestId") travelRequestId: string) {
    const data = await this.service.listForTravelRequest(travelRequestId);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async addSegment(@Param("travelRequestId") travelRequestId: string, @Body() dto: CreateItinerarySegmentDto) {
    const data = await this.service.addSegment(travelRequestId, dto);
    return { data };
  }

  @Delete(":segmentId")
  @HttpCode(200)
  async removeSegment(@Param("travelRequestId") travelRequestId: string, @Param("segmentId") segmentId: string) {
    await this.service.removeSegment(travelRequestId, segmentId);
    return { data: { removed: true } };
  }
}
