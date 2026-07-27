import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AddDocumentVersionDto } from "./dto/add-document-version.dto";
import { CreateDocumentDto } from "./dto/create-document.dto";
import { DocumentService } from "./document.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/24-document-management.md */
@Controller("documents")
export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  @Post()
  @HttpCode(201)
  @Roles("org_admin", "hr_ops")
  async create(@Body() dto: CreateDocumentDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Get()
  @Roles("org_admin", "hr_ops")
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const data = await this.service.findOne(id);
    return { data };
  }

  @Post(":id/versions")
  @HttpCode(201)
  @Roles("org_admin", "hr_ops")
  async addVersion(@Param("id") id: string, @Body() dto: AddDocumentVersionDto) {
    const data = await this.service.addVersion(id, dto);
    return { data };
  }

  @Post(":id/publish")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async publish(@Param("id") id: string) {
    const data = await this.service.publish(id);
    return { data };
  }

  @Post(":id/archive")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async archive(@Param("id") id: string) {
    const data = await this.service.archive(id);
    return { data };
  }

  @Post("expiry-sweep/run-now")
  @HttpCode(200)
  @Roles("org_admin", "hr_ops")
  async runExpirySweepNow() {
    await this.service.runExpirySweepNow();
    return { data: { triggered: true } };
  }
}
