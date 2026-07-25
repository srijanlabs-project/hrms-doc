import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { AssetService } from "./asset.service";
import { AssignAssetDto } from "./dto/assign-asset.dto";
import { ReturnAssetDto } from "./dto/return-asset.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/18-asset-management/01-asset-assignment.md, 02-asset-return.md */
@Controller("assets/assignments")
export class AssetAssignmentController {
  constructor(private readonly service: AssetService) {}

  @Get("my")
  async listMine() {
    const data = await this.service.listMyAssignments();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Get("all")
  async listAll() {
    const data = await this.service.listAllAssignments();
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post()
  @HttpCode(201)
  async assign(@Body() dto: AssignAssetDto) {
    const data = await this.service.assign(dto.assetId, dto.employeeId);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post(":id/return")
  @HttpCode(200)
  async returnAsset(@Param("id") id: string, @Body() dto: ReturnAssetDto) {
    const data = await this.service.returnAsset(id, dto.condition, dto.notes);
    return { data };
  }
}
