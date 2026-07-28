import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateFeatureFlagDto } from "./dto/create-feature-flag.dto";
import { SetFeatureFlagDto } from "./dto/set-feature-flag.dto";
import { FeatureFlagService } from "./feature-flag.service";

/** W0·E30 DevOps and Operations — admin console: feature toggles. */
@Roles("org_admin", "hr_ops")
@Controller("feature-flags")
export class FeatureFlagController {
  constructor(private readonly service: FeatureFlagService) {}

  @Get()
  async list() {
    return { data: await this.service.list() };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateFeatureFlagDto) {
    return { data: await this.service.create(dto) };
  }

  @Put(":key")
  async setEnabled(@Param("key") key: string, @Body() dto: SetFeatureFlagDto) {
    return { data: await this.service.setEnabled(key, dto.enabled) };
  }

  @Delete(":key")
  @HttpCode(204)
  async remove(@Param("key") key: string) {
    await this.service.remove(key);
  }
}
