import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { Public } from "../../auth/decorators/public.decorator";
import { ProvisionTenantDto } from "./dto/provision-tenant.dto";
import { PlatformKeyGuard } from "./platform-key.guard";
import { ProvisioningService } from "./provisioning.service";

/** W0·E28 Administration — tenant provisioning. @Public() bypasses AuthGuard (no tenant session exists yet); PlatformKeyGuard is the real gate. */
@Public()
@UseGuards(PlatformKeyGuard)
@Controller("platform/tenants")
export class ProvisioningController {
  constructor(private readonly service: ProvisioningService) {}

  @Post()
  @HttpCode(201)
  async provision(@Body() dto: ProvisionTenantDto) {
    return { data: await this.service.provision(dto) };
  }
}
