import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompleteBackgroundCheckDto } from "./dto/complete-background-check.dto";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { InitiateBackgroundCheckDto } from "./dto/initiate-background-check.dto";
import { OfferResponseDto } from "./dto/offer-response.dto";
import { OfferService } from "./offer.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/06-recruitment-and-ats/08-offer-management.md */
@Controller("recruitment/offers")
@Roles("org_admin", "hr_ops")
export class OfferController {
  constructor(private readonly service: OfferService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateOfferDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/issue")
  @HttpCode(200)
  async issue(@Param("id") id: string) {
    const data = await this.service.issue(id);
    return { data };
  }

  @Post(":id/respond")
  @HttpCode(200)
  async respond(@Param("id") id: string, @Body() dto: OfferResponseDto) {
    const data = await this.service.respond(id, dto.accepted, dto.declineReason);
    return { data };
  }

  @Post(":id/convert")
  @HttpCode(200)
  async convert(@Param("id") id: string) {
    const data = await this.service.convert(id);
    return { data };
  }

  @Post(":id/background-check")
  @HttpCode(201)
  async initiateBackgroundCheck(@Param("id") id: string, @Body() dto: InitiateBackgroundCheckDto) {
    const data = await this.service.initiateBackgroundCheck(id, dto);
    return { data };
  }

  @Post(":id/background-check/complete")
  @HttpCode(200)
  async completeBackgroundCheck(@Param("id") id: string, @Body() dto: CompleteBackgroundCheckDto) {
    const data = await this.service.completeBackgroundCheck(id, dto);
    return { data };
  }
}
