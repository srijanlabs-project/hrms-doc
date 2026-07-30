import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CompanySetupService } from "./company-setup.service";
import {
  SetupEmployeesDto,
  SetupManagersDto,
  SetupSalaryDto,
  SetupStructureDto,
} from "./dto/setup-steps.dto";

/** HTTP only — no business logic. Each step is its own endpoint so a migration commits one stage at a time and can be verified in between. */
@Roles("org_admin", "hr_ops")
@Controller("implementation/company-setup")
export class CompanySetupController {
  constructor(private readonly service: CompanySetupService) {}

  @Get("status")
  async status() {
    const data = await this.service.status();
    return { data };
  }

  @Post("structure")
  @HttpCode(200)
  async structure(@Body() dto: SetupStructureDto) {
    const data = await this.service.applyStructure(dto);
    return { data };
  }

  @Post("employees")
  @HttpCode(200)
  async employees(@Body() dto: SetupEmployeesDto) {
    const data = await this.service.applyEmployees(dto);
    return { data };
  }

  @Post("managers")
  @HttpCode(200)
  async managers(@Body() dto: SetupManagersDto) {
    const data = await this.service.applyManagers(dto);
    return { data };
  }

  @Post("salary")
  @HttpCode(200)
  async salary(@Body() dto: SetupSalaryDto) {
    const data = await this.service.applySalary(dto);
    return { data };
  }
}
