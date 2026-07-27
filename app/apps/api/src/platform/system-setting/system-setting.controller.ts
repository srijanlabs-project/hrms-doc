import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UpsertSystemSettingDto } from "./dto/upsert-system-setting.dto";
import { SystemSettingService } from "./system-setting.service";

/** W0·E28 Administration — admin console: system settings. */
@Roles("org_admin", "hr_ops")
@Controller("system-settings")
export class SystemSettingController {
  constructor(private readonly service: SystemSettingService) {}

  @Get()
  async list() {
    return { data: await this.service.list() };
  }

  @Put(":key")
  async upsert(@Param("key") key: string, @Body() dto: UpsertSystemSettingDto) {
    return { data: await this.service.upsert(key, dto.value, dto.description) };
  }

  @Delete(":key")
  async remove(@Param("key") key: string) {
    await this.service.delete(key);
    return { data: { deleted: true } };
  }
}
