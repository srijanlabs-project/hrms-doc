import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../auth/decorators/roles.decorator";
import { AssetService } from "./asset.service";
import { CreateAssetDto } from "./dto/create-asset.dto";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/18-asset-management/01-asset-assignment.md */
@Roles("org_admin", "hr_ops")
@Controller("assets")
export class AssetController {
  constructor(private readonly service: AssetService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateAssetDto) {
    const data = await this.service.createAsset(dto);
    return { data };
  }

  @Get()
  async list() {
    const data = await this.service.listAssets();
    return { data };
  }
}
