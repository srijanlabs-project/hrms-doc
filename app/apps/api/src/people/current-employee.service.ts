import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth/auth.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../platform/errors/errors";
import type { EmployeeWithDepartment } from "./employee/employee.repository";
import { EmployeeRepository } from "./employee/employee.repository";

/**
 * Resolves the Employee record linked to the currently authenticated User.
 * Shared across every module that needs "who am I as an employee" (leave,
 * attendance, payroll self-service), not just one — lives in PeopleModule
 * since that's the module that already owns EmployeeRepository.
 */
@Injectable()
export class CurrentEmployeeService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async resolve(): Promise<{ tenantId: string; userId: string; employee: EmployeeWithDepartment }> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }

    const user = await this.authRepository.findUserById(tenantId, userId);
    if (!user?.employeeId) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Your account is not linked to an employee record.");
    }

    const employee = await this.employeeRepository.findById(tenantId, user.employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Your linked employee record could not be found.");
    }

    return { tenantId, userId, employee };
  }
}
