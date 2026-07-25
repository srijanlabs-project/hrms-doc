import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CertificationService } from "./certification.service";
import { CreateCertificationCatalogDto } from "./dto/create-catalog-entry.dto";
import { CreateCertificationRecordDto } from "./dto/create-record.dto";
import { RevokeCertificationRecordDto } from "./dto/revoke-record.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HTTP only — no business logic. Spec: 08-submodule-specifications/12-learning-and-development/02-certifications.md */
@Controller("learning/certifications")
export class CertificationController {
  constructor(private readonly service: CertificationService) {}

  @Get("catalog")
  async listCatalog() {
    const data = await this.service.listCatalog();
    return { data };
  }

  @Get("my")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Get("records")
  async listAll(@Query("status") status?: string) {
    const data = await this.service.listAll(status);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("catalog")
  @HttpCode(201)
  async createCatalogEntry(@Body() dto: CreateCertificationCatalogDto) {
    const data = await this.service.createCatalogEntry(dto);
    return { data };
  }

  @Post("records")
  @HttpCode(201)
  async createRecord(@Body() dto: CreateCertificationRecordDto) {
    const data = await this.service.createRecord(dto);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("records/:id/verify")
  @HttpCode(200)
  async verify(@Param("id") id: string) {
    const data = await this.service.verify(id);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("records/:id/revoke")
  @HttpCode(200)
  async revoke(@Param("id") id: string, @Body() dto: RevokeCertificationRecordDto) {
    const data = await this.service.revoke(id, dto.reason);
    return { data };
  }

  @Roles(...ADMIN_ROLES)
  @Post("run-now")
  @HttpCode(200)
  async runNow() {
    await this.service.runNow();
    return { data: { triggered: true } };
  }
}
