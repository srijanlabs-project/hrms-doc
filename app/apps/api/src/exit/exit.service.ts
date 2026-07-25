import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { PayslipService } from "../payroll/payslip/payslip.service";

/**
 * Self-service "what can I still see" surface for an exited employee, v1
 * slice of docs/08-submodule-specifications/02-people-management/13-exit.md.
 * Deliberately narrow: identity + exit facts + payslip history only — no
 * document downloads (relieving letter, Form 16), no F&F-settlement status,
 * no alumni-network features. Works regardless of Employee.status; it's the
 * one self-service surface ExitStatusGuard leaves reachable after exit.
 */
@Injectable()
export class ExitService {
  constructor(
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly payslipService: PayslipService,
  ) {}

  async getMine() {
    const { employee } = await this.currentEmployee.resolve();
    const payslips = await this.payslipService.listMine();
    return {
      employeeCode: employee.employeeCode,
      legalName: employee.legalName,
      department: employee.department?.name ?? null,
      status: employee.status,
      lastWorkingDay: employee.lastWorkingDay,
      exitReason: employee.exitReason,
      payslips,
    };
  }
}
