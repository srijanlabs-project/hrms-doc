import { Injectable } from "@nestjs/common";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { ValidationAppError } from "../platform/errors/errors";
import { evaluateFlexCompliance } from "../workforce/flex/flex-compliance";
import { FlexRepository } from "../workforce/flex/flex.repository";
import { AttendanceRepository } from "./attendance.repository";
import type { MarkAttendanceDto } from "./dto/mark-attendance.dto";

function toUtcDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

function todayUtcDate(): Date {
  return toUtcDate(new Date().toISOString().slice(0, 10));
}

/**
 * v1 slice of docs/08-submodule-specifications/07-workforce-management/01-attendance.md:
 * manual daily status only (Present/Absent/HalfDay), self-marked. No punch
 * events, shifts, geofencing, exceptions, regularization workflow, or period
 * finalization — those require capture-device and workflow infrastructure
 * this build doesn't have. AttendanceDay.source stays "Manual" until a real
 * capture channel exists to justify the field.
 */
@Injectable()
export class AttendanceService {
  constructor(
    private readonly repository: AttendanceRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly flexRepository: FlexRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async mark(dto: MarkAttendanceDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const date = toUtcDate(dto.date);
    if (date > todayUtcDate()) {
      throw new ValidationAppError([
        { field: "date", code: "FUTURE_DATE", message: "Attendance cannot be marked for a future date." },
      ]);
    }

    let flexCompliant: boolean | undefined;
    if (dto.checkInTime && dto.checkOutTime) {
      const flexAssignment = await this.flexRepository.findActiveForEmployee(tenantId, employee.id);
      if (flexAssignment) {
        flexCompliant = evaluateFlexCompliance(flexAssignment.policy, dto.checkInTime, dto.checkOutTime);
      }
    }

    return this.repository.mark(tenantId, employee.id, date, dto.status, {
      checkInTime: dto.checkInTime,
      checkOutTime: dto.checkOutTime,
      flexCompliant,
    });
  }

  async listMine(from?: string, to?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const { rangeStart, rangeEnd } = this.resolveRange(from, to);
    return this.repository.findForEmployeeRange(tenantId, employee.id, rangeStart, rangeEnd);
  }

  /** Direct reports only (Employee.managerId), for the given date. No entry means "Not Marked". */
  async listTeamForDate(dateInput?: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const date = dateInput ? toUtcDate(dateInput) : todayUtcDate();

    const reports = await this.employeeRepository.findByManagerId(tenantId, employee.id);
    if (reports.length === 0) return [];

    const records = await this.repository.findForEmployeesOnDate(
      tenantId,
      reports.map((r) => r.id),
      date,
    );
    const byEmployeeId = new Map(records.map((r) => [r.employeeId, r]));

    return reports.map((report) => ({
      employeeId: report.id,
      employeeCode: report.employeeCode,
      legalName: report.legalName,
      department: report.department?.name ?? null,
      date: date.toISOString().slice(0, 10),
      status: byEmployeeId.get(report.id)?.status ?? "Not Marked",
    }));
  }

  private resolveRange(from?: string, to?: string): { rangeStart: Date; rangeEnd: Date } {
    if (from && to) {
      return { rangeStart: toUtcDate(from), rangeEnd: toUtcDate(to) };
    }
    const today = new Date();
    const monthStart = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
    const monthEnd = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
    return { rangeStart: monthStart, rangeEnd: monthEnd };
  }
}
