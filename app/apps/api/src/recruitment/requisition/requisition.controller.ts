import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateRequisitionDto } from "./dto/create-requisition.dto";
import { RequisitionService } from "./requisition.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/06-recruitment-and-ats/02-requisitions.md */
@Controller("recruitment/requisitions")
@Roles("org_admin", "hr_ops")
export class RequisitionController {
  constructor(private readonly service: RequisitionService) {}

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
  async create(@Body() dto: CreateRequisitionDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/publish")
  @HttpCode(200)
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Post(":id/close")
  @HttpCode(200)
  async close(@Param("id") id: string) {
    const data = await this.service.close(id);
    return { data };
  }
}
