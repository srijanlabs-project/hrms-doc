import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { VendorService } from "./vendor.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/20-contractor-external-workforce.md */
@Roles("org_admin", "hr_ops")
@Controller("contractor/vendors")
export class VendorController {
  constructor(private readonly service: VendorService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateVendorDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }
}
