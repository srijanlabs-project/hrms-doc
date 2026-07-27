import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { AddCheckInNotesDto } from "./dto/add-checkin-notes.dto";
import { CreateCheckInDto } from "./dto/create-checkin.dto";
import { CheckInService } from "./checkin.service";

/** HTTP only — no business logic. Spec: docs/03-module-specifications/11-performance-management.md */
@Controller("performance/check-ins")
export class CheckInController {
  constructor(private readonly service: CheckInService) {}

  @Get("mine")
  async listMine() {
    const data = await this.service.listMine();
    return { data };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateCheckInDto) {
    const data = await this.service.create(dto);
    return { data };
  }

  @Post(":id/manager-notes")
  @HttpCode(200)
  async addManagerNotes(@Param("id") id: string, @Body() dto: AddCheckInNotesDto) {
    const data = await this.service.addManagerNotes(id, dto.notes);
    return { data };
  }

  @Post(":id/employee-notes")
  @HttpCode(200)
  async addEmployeeNotes(@Param("id") id: string, @Body() dto: AddCheckInNotesDto) {
    const data = await this.service.addEmployeeNotes(id, dto.notes);
    return { data };
  }

  @Post(":id/complete")
  @HttpCode(200)
  async complete(@Param("id") id: string) {
    const data = await this.service.complete(id);
    return { data };
  }

  @Post(":id/cancel")
  @HttpCode(200)
  async cancel(@Param("id") id: string) {
    const data = await this.service.cancel(id);
    return { data };
  }
}
