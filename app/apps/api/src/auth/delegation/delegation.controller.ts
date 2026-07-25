import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { CreateDelegationDto } from "./dto/create-delegation.dto";
import { DelegationService } from "./delegation.service";

/** HTTP only — no business logic. Delegation engine (06-delegation.md). */
@Controller("access/delegations")
export class DelegationController {
  constructor(private readonly service: DelegationService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateDelegationDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Post(":id/revoke")
  @HttpCode(200)
  async revoke(@Param("id") id: string) {
    const data = await this.service.revoke(id);
    return { data };
  }
}
