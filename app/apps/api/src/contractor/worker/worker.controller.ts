import { Body, Controller, Get, HttpCode, Param, Post, Query } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { AddDocumentDto } from "./dto/add-document.dto";
import { CreateWorkerDto } from "./dto/create-worker.dto";
import { RejectWorkerDto } from "./dto/reject-worker.dto";
import { SuspendWorkerDto } from "./dto/suspend-worker.dto";
import { WorkerService } from "./worker.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/20-contractor-external-workforce.md */
@Roles("org_admin", "hr_ops")
@Controller("contractor/workers")
export class WorkerController {
  constructor(private readonly service: WorkerService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateWorkerDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Get()
  async listAll(@Query("status") status?: string, @Query("vendorId") vendorId?: string) {
    const data = await this.service.listAll(status, vendorId);
    return { data };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const data = await this.service.getById(id);
    return { data };
  }

  @Post(":id/submit")
  @HttpCode(200)
  async submit(@Param("id") id: string) {
    const data = await this.service.submit(id);
    return { data };
  }

  @Post(":id/approve")
  @HttpCode(200)
  async approve(@Param("id") id: string) {
    const data = await this.service.approve(id);
    return { data };
  }

  @Post(":id/reject")
  @HttpCode(200)
  async reject(@Param("id") id: string, @Body() dto: RejectWorkerDto) {
    const data = await this.service.reject(id, dto);
    return { data };
  }

  @Post(":id/suspend")
  @HttpCode(200)
  async suspend(@Param("id") id: string, @Body() dto: SuspendWorkerDto) {
    const data = await this.service.suspend(id, dto);
    return { data };
  }

  @Post(":id/reactivate")
  @HttpCode(200)
  async reactivate(@Param("id") id: string) {
    const data = await this.service.reactivate(id);
    return { data };
  }

  @Post(":id/deactivate")
  @HttpCode(200)
  async deactivate(@Param("id") id: string) {
    const data = await this.service.deactivate(id);
    return { data };
  }

  @Post(":id/documents")
  @HttpCode(201)
  async addDocument(@Param("id") id: string, @Body() dto: AddDocumentDto) {
    const data = await this.service.addDocument(id, dto);
    return { data };
  }

  @Post("documents/:documentId/verify")
  @HttpCode(200)
  async verifyDocument(@Param("documentId") documentId: string) {
    const data = await this.service.verifyDocument(documentId);
    return { data };
  }

  @Post("expiry-sweep/run-now")
  @HttpCode(200)
  async runExpirySweepNow() {
    await this.service.runExpirySweepNow();
    return { data: { triggered: true } };
  }
}
