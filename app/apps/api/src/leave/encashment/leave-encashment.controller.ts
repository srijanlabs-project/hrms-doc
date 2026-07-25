import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateEncashmentRequestDto } from "./dto/create-encashment-request.dto";
import { RejectEncashmentRequestDto } from "./dto/reject-encashment-request.dto";
import { LeaveEncashmentService } from "./leave-encashment.service";

/** HTTP only — no business logic. Leave Management (E08) leave encashment. */
@Controller("leave/encashment")
export class LeaveEncashmentController {
  constructor(private readonly service: LeaveEncashmentService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateEncashmentRequestDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectEncashmentRequestDto) {
    const data = await this.service.reject(id, dto);
    return { data };
  }
}
