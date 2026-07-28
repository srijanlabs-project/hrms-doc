import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateEsopGrantDto } from "./dto/create-esop-grant.dto";
import { EsopService } from "./esop.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Wave 3 E14 gap closure: ESOPs. */
@Controller("compensation-planning/esop-grants")
export class EsopController {
  constructor(private readonly service: EsopService) {}

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get()
  async listAllAdmin() {
    const data = await this.service.listAllAdmin();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEsopGrantDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }
}
