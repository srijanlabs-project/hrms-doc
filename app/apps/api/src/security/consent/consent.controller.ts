import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { ConsentService } from "./consent.service";
import { SetConsentDto } from "./dto/set-consent.dto";

/** W0·E29 Security and Governance — consent management. */
@Controller("consent")
export class ConsentController {
  constructor(private readonly service: ConsentService) {}

  @Get("mine")
  async listMine() {
    return { data: await this.service.listMine() };
  }

  @Put("mine/:purpose")
  async setMine(@Param("purpose") purpose: string, @Body() dto: SetConsentDto) {
    return { data: await this.service.setMine(purpose, dto.status, dto.notes) };
  }

  @Get("employees/:employeeId")
  async listForEmployee(@Param("employeeId") employeeId: string) {
    return { data: await this.service.listForEmployee(employeeId) };
  }

  @Get()
  @Roles("org_admin", "hr_ops")
  async listAll() {
    return { data: await this.service.listAll() };
  }
}
