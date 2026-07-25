import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { PayrollRunRepository } from "../run/payroll-run.repository";

@Injectable()
export class PayslipService {
  constructor(
    private readonly runRepository: PayrollRunRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.runRepository.findApprovedResultsForEmployee(tenantId, employee.id);
  }

  async getMine(periodYear: number, periodMonth: number) {
    if (!Number.isInteger(periodYear) || !Number.isInteger(periodMonth) || periodMonth < 1 || periodMonth > 12) {
      throw new ValidationAppError([{ field: "period", code: "INVALID", message: "Invalid year/month." }]);
    }

    const { tenantId, employee } = await this.currentEmployee.resolve();
    const result = await this.runRepository.findApprovedResultForEmployee(tenantId, employee.id, periodYear, periodMonth);
    if (!result) {
      throw new NotFoundAppError("OBJ-PAYSLIP", "No approved payslip found for that period.");
    }
    return result;
  }
}
