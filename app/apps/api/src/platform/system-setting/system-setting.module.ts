import { Module } from "@nestjs/common";
import { SystemSettingController } from "./system-setting.controller";
import { SystemSettingRepository } from "./system-setting.repository";
import { SystemSettingService } from "./system-setting.service";

@Module({
  controllers: [SystemSettingController],
  providers: [SystemSettingService, SystemSettingRepository],
})
export class SystemSettingModule {}
