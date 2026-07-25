import { Injectable } from "@nestjs/common";
import { AttendanceService } from "../attendance/attendance.service";
import { LeaveBalanceService } from "../leave/balance/leave-balance.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { PayslipService } from "../payroll/payslip/payslip.service";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Real tenant-data lookups Ridz can answer from — the "tools" layer that any
 * AiProvider (dev stand-in or a real Claude integration) draws on. Reuses
 * the exact same self-service logic as the Attendance/Leave/Payroll pages
 * (CurrentEmployeeService under the hood), so an answer is never out of
 * sync with what the employee sees on those pages themselves.
 */
@Injectable()
export class AiDataService {
  constructor(
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly attendanceService: AttendanceService,
    private readonly payslipService: PayslipService,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async getLeaveBalances() {
    return this.leaveBalanceService.getMyBalances();
  }

  async getTodayAttendanceStatus(): Promise<string> {
    const today = todayIso();
    const days = await this.attendanceService.listMine(today, today);
    return days[0]?.status ?? "Not Marked";
  }

  /** Empty for anyone with no direct reports — same permissive behavior as the Attendance page's team card. */
  async getTeamAttendanceToday() {
    return this.attendanceService.listTeamForDate(todayIso());
  }

  async getLatestPayslip() {
    const payslips = await this.payslipService.listMine();
    return payslips[0] ?? null;
  }

  async getHeadcount(tenantId: string): Promise<number> {
    const employees = await this.employeeRepository.findAll(tenantId);
    return employees.length;
  }
}
