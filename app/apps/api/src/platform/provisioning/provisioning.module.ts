import { Module } from "@nestjs/common";
import { PlatformKeyGuard } from "./platform-key.guard";
import { ProvisioningController } from "./provisioning.controller";
import { ProvisioningService } from "./provisioning.service";

@Module({
  controllers: [ProvisioningController],
  providers: [ProvisioningService, PlatformKeyGuard],
})
export class ProvisioningModule {}
