import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceService } from "./resource.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/21-visitor-workplace-management.md */
@Controller("workplace/resources")
export class ResourceController {
  constructor(private readonly service: ResourceService) {}

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
  async create(@Body() dto: CreateResourceDto) {
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
