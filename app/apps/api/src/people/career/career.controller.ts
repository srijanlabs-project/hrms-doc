import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common";
import { Roles } from "../../auth/decorators/roles.decorator";
import { CareerService } from "./career.service";
import { CreateContractRenewalDto } from "./dto/create-contract-renewal.dto";
import { CreateEmployeeDocumentDto } from "./dto/create-employee-document.dto";
import { CreateMovementDto } from "./dto/create-movement.dto";
import { CreateProbationDto } from "./dto/create-probation.dto";
import { DecideProbationDto } from "./dto/decide-probation.dto";

/** HTTP only — no business logic. Covers employment info/promotion-demotion-transfer/deputation, probation, contract renewal, and employee documents. */
@Controller("people/employees/:employeeId")
export class CareerController {
  constructor(private readonly service: CareerService) {}

  @Get("career")
  async getAll(@Param("employeeId") employeeId: string) {
    const data = await this.service.getAll(employeeId);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("movements")
  @HttpCode(201)
  async createMovement(@Param("employeeId") employeeId: string, @Body() dto: CreateMovementDto) {
    const data = await this.service.createMovement(employeeId, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("probation")
  @HttpCode(201)
  async createProbation(@Param("employeeId") employeeId: string, @Body() dto: CreateProbationDto) {
    const data = await this.service.createProbation(employeeId, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("probation/:id/decide")
  @HttpCode(200)
  async decideProbation(@Param("id") id: string, @Body() dto: DecideProbationDto) {
    const data = await this.service.decideProbation(id, dto);
    return { data };
  }

  @Roles("org_admin", "hr_ops")
  @Post("contract-renewals")
  @HttpCode(201)
  async createContractRenewal(@Param("employeeId") employeeId: string, @Body() dto: CreateContractRenewalDto) {
    const data = await this.service.createContractRenewal(employeeId, dto);
    return { data };
  }

  @Post("documents")
  @HttpCode(201)
  async addDocument(@Param("employeeId") employeeId: string, @Body() dto: CreateEmployeeDocumentDto) {
    const data = await this.service.addDocument(employeeId, dto);
    return { data };
  }
}
