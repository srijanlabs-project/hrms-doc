import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from "@nestjs/common";
import { CreateEmergencyContactDto } from "./dto/create-emergency-contact.dto";
import { RevealMedicalFieldDto } from "./dto/reveal-medical-field.dto";
import { UpsertPersonalDetailDto } from "./dto/upsert-personal-detail.dto";
import { PersonalDetailService } from "./personal-detail.service";

/** HTTP only — no business logic. Spec: 08-submodule-specifications/02-people-management/02-personal-information.md */
@Controller("people/employees/:employeeId/personal-detail")
export class PersonalDetailController {
  constructor(private readonly service: PersonalDetailService) {}

  @Get()
  async get(@Param("employeeId") employeeId: string) {
    const data = await this.service.get(employeeId);
    return { data };
  }

  @Put()
  @HttpCode(200)
  async upsert(@Param("employeeId") employeeId: string, @Body() dto: UpsertPersonalDetailDto) {
    const data = await this.service.upsert(employeeId, dto);
    return { data };
  }

  @Post("emergency-contacts")
  @HttpCode(201)
  async addEmergencyContact(@Param("employeeId") employeeId: string, @Body() dto: CreateEmergencyContactDto) {
    const data = await this.service.addEmergencyContact(employeeId, dto);
    return { data };
  }

  @Delete("emergency-contacts/:id")
  @HttpCode(200)
  async removeEmergencyContact(@Param("employeeId") employeeId: string, @Param("id") id: string) {
    await this.service.removeEmergencyContact(employeeId, id);
    return { data: { deleted: true } };
  }

  @Post("medical-info/reveal")
  @HttpCode(200)
  async revealMedicalField(@Param("employeeId") employeeId: string, @Body() dto: RevealMedicalFieldDto) {
    const data = await this.service.revealMedicalField(employeeId, dto);
    return { data };
  }
}
