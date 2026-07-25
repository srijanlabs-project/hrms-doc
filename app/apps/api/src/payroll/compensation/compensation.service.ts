import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CompensationRepository } from "./compensation.repository";
import type { SetCompensationDto } from "./dto/set-compensation.dto";

@Injectable()
export class CompensationService {
  constructor(
    private readonly repository: CompensationRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async list() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.findAll(tenantId);
  }

  async set(dto: SetCompensationDto) {
    const { tenantId } = this.requireAuthenticated();

    const employee = await this.employeeRepository.findById(tenantId, dto.employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }

    return this.repository.upsert(tenantId, dto.employeeId, {
      monthlyBasic: dto.monthlyBasic,
      effectiveFrom: new Date(dto.effectiveFrom),
    });
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
