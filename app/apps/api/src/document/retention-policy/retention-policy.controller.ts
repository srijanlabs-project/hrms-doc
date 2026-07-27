import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CreateRetentionPolicyDto } from "./dto/create-retention-policy.dto";
import { RetentionPolicyService } from "./retention-policy.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/24-document-management.md */
@Controller("documents/retention-policies")
@Roles("org_admin", "hr_ops")
export class RetentionPolicyController {
  constructor(private readonly service: RetentionPolicyService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateRetentionPolicyDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listAll() {
    const data = await this.service.listAll();
    return { data };
  }
}
