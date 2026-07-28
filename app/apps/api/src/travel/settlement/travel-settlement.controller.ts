import { Controller, Get, Param } from "@nestjs/common";
import { TravelSettlementService } from "./travel-settlement.service";

/** HTTP only — no business logic. Wave 3 W4·E16 gap closure: travel expense settlement. */
@Controller("travel/requests/:travelRequestId/settlement")
export class TravelSettlementController {
  constructor(private readonly service: TravelSettlementService) {}

  @Get()
  async getSettlement(@Param("travelRequestId") travelRequestId: string) {
    const data = await this.service.getSettlement(travelRequestId);
    return { data };
  }
}
