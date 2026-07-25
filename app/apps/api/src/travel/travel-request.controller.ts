import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { CreateTravelRequestDto } from "./dto/create-travel-request.dto";
import { DecideTravelRequestDto } from "./dto/decide-travel-request.dto";
import { TravelRequestService } from "./travel-request.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/16-travel-management/01-travel-requests.md */
@Controller("travel/requests")
export class TravelRequestController {
  constructor(private readonly service: TravelRequestService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTravelRequestDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get("team")
  async listForApproval() {
    const data = await this.service.listForApproval();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string, @Body() dto: DecideTravelRequestDto) {
    const data = await this.service.decide(id, "Approved", dto.note);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: DecideTravelRequestDto) {
    const data = await this.service.decide(id, "Rejected", dto.note);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    await this.service.cancel(id);
    return { data: { cancelled: true } };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/mark-completed")
  @HttpCode(200)
  async markCompleted(@Param("id") id: string) {
    const data = await this.service.markCompleted(id);
    return { data };
  }
}
