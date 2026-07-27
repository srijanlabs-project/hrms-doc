import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateEmergencyResponseContactDto } from "./dto/create-emergency-response-contact.dto";
import { EmergencyResponseContactService } from "./emergency-response-contact.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/22-health-safety-wellness.md */
@Controller("health-safety/emergency-contacts")
export class EmergencyResponseContactController {
  constructor(private readonly service: EmergencyResponseContactService) {}

  @Get()
  async listActive() {
    const data = await this.service.listActive();
    return { data };
  }

  @Get("all")
  @Roles("org_admin", "hr_ops")
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }

  @Post()
  @HttpCode(201)
  @Roles("org_admin", "hr_ops")
  async create(@Body() dto: CreateEmergencyResponseContactDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/deactivate")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async deactivate(@Param("id") id: string) {
    const data = await this.service.setActive(id, false);
    return { data };
  }

  @Post(":id/activate")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async activate(@Param("id") id: string) {
    const data = await this.service.setActive(id, true);
    return { data };
  }
}
