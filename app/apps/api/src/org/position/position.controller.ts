import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreatePositionDto } from "./dto/create-position.dto";
import { UpdatePositionStatusDto } from "./dto/update-position-status.dto";
import { PositionService } from "./position.service";

/** HTTP only — no business logic. Wave 1 Org Management deepening (position management — no dedicated spec, see schema.prisma's Position comment). */
@Controller("org/positions")
export class PositionController {
  constructor(private readonly service: PositionService) {}

  @Get()
  async list() {
    const data = await this.service.list();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreatePositionDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/status")
  @HttpCode(200)
  async updateStatus(@Param("id") id: string, @Body() dto: UpdatePositionStatusDto) {
    const data = await this.service.updateStatus(id, dto.status);
    return { data };
  }
}
