import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompleteMaintenanceRecordDto } from "./dto/complete-maintenance-record.dto";
import { CreateMaintenanceRecordDto } from "./dto/create-maintenance-record.dto";
import { MaintenanceService } from "./maintenance.service";

/** HTTP only — no business logic. Wave 4·E18 gap closure ("asset maintenance"). Admin-only. */
@Roles("org_admin", "hr_ops")
@Controller("assets/maintenance")
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateMaintenanceRecordDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Get("asset/:assetId")
  async listForAsset(@Param("assetId") assetId: string) {
    const data = await this.service.listForAsset(assetId);
    return { data };
  }

  @Post(":id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string, @Body() dto: CompleteMaintenanceRecordDto) {
    const data = await this.service.complete(id, dto.notes);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }
}
