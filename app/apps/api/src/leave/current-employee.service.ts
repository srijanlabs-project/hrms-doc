import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../auth/auth.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../platform/errors/errors";
import type { EmployeeWithDepartment } from "../people/employee/employee.repository";
import { EmployeeRepository } from "../people/employee/employee.repository";

/**
 * Resolves the Employee record linked to the currently authenticated User.
 * Shared by leave balance and leave request services rather than duplicated
 * — every self-service leave action needs "who am I as an employee", not
 * just "who am I as a user".
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
