import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateTravelAdvanceDto } from "./dto/create-travel-advance.dto";
import { DecideTravelAdvanceDto } from "./dto/decide-travel-advance.dto";
import { TravelAdvanceService } from "./travel-advance.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 3 W4·E16 gap closure: travel advances. */
@Controller("travel/advances")
export class TravelAdvanceController {
  constructor(private readonly service: TravelAdvanceService) {}

  @Post()
  @HttpCode(201)
  async request(@Query("travelRequestId") travelRequestId: string, @Body() dto: CreateTravelAdvanceDto) {
    const data = await this.service.request(travelRequestId, dto);
    return { data };
  }

  @Get()
  async listForTravelRequest(@Query("travelRequestId") travelRequestId: string) {
    const data = await this.service.listForTravelRequest(travelRequestId);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("all")
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideTravelAdvanceDto) {
    const data = await this.service.decide(id, "Approved", dto.approvedAmount, dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideTravelAdvanceDto) {
    const data = await this.service.decide(id, "Rejected", undefined, dto.note);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post(":id/disburse")
  @HttpCode(200)
  async disburse(@Param("id") id: string) {
    const data = await this.service.disburse(id);
    return { data };
  }
}
