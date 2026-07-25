import { Injectable } from "@nestjs/common";
import { AttendanceRepository } from "../attendance/attendance.repository";
import { LeaveRequestRepository } from "../leave/request/leave-request.repository";
import { OnboardingCaseRepository } from "../onboarding/onboarding-case.repository";
import { PayrollRunRepository } from "../payroll/run/payroll-run.repository";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { AuthenticationAppError } from "../platform/errors/errors";
import { ApplicationRepository } from "../recruitment/candidate/application.repository";
import { RequisitionRepository } from "../recruitment/requisition/requisition.repository";

function todayUtcDate(): Date {
  return new Date(`${new Date().toISOString().slice(0, 10)}T00:00:00.000Z`);
}

/**
 * Reports v1 — a fixed set of hardcoded KPI queries across the modules
 * already built, not the configurable report-builder/custom-report engine
 * described in docs/08-submodule-specifications/25-analytics-and-bi/04-custom-reports.md
 * (no saved reports, no ad-hoc filters, no export). Each number is a live
 * aggregate query, not a cached/precomputed snapshot.
 */
@Injectable()
export class ReportsService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly leaveRequestRepository: LeaveRequestRepository,
    private readonly payrollRunRepository: PayrollRunRepository,
    private readonly requisitionRepository: RequisitionRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly onboardingCaseRepository: OnboardingCaseRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getSummary() {
    const { tenantId } = this.requireAuthenticated();

    const employees = await this.employeeRepository.findAll(tenantId);
    const activeEmployees = employees.filter((e) => e.status === "Active");
    const headcountByStatus: Record<string, number> = {};
    for (const employee of employees) {
      headcountByStatus[employee.status] = (headcountByStatus[employee.status] ?? 0) + 1;
    }

    const attendanceToday = await this.attendanceRepository.findForEmployeesOnDate(
      tenantId,
      activeEmployees.map((e) => e.id),
      todayUtcDate(),
    );
    const attendanceByStatus = { Present: 0, Absent: 0, HalfDay: 0 };
    for (const day of attendanceToday) {
      if (day.status in attendanceByStatus) {
        attendanceByStatus[day.status as keyof typeof attendanceByStatus] += 1;
      }
    }

    const [pendingLeaveRequests, requisitions, applicationsByStage, onboardingCases, latestClosedRun] =
      await Promise.all([
        this.leaveRequestRepository.countByStatus(tenantId, "Pending"),
        this.requisitionRepository.findAll(tenantId),
        this.applicationRepository.countByStage(tenantId),
        this.onboardingCaseRepository.findAll(tenantId),
        this.payrollRunRepository.findLatestClosed(tenantId),
      ]);

    const openRequisitions = requisitions.filter((r) => r.status === "Published");

    return {
      headcount: {
        total: employees.length,
        active: activeEmployees.length,
        byStatus: headcountByStatus,
      },
      attendanceToday: {
        ...attendanceByStatus,
        notMarked: activeEmployees.length - attendanceToday.length,
      },
      leave: {
        pendingRequests: pendingLeaveRequests,
      },
      recruitment: {
        openRequisitions: openRequisitions.length,
        openHeadcountDemand: openRequisitions.reduce((sum, r) => sum + r.headcount, 0),
        applicationsByStage,
      },
      onboarding: {
        inProgress: onboardingCases.filter((c) => c.status === "InProgress").length,
        activated: onboardingCases.filter((c) => c.status === "Activated").length,
      },
      payrollCost: latestClosedRun
        ? {
            periodYear: latestClosedRun.periodYear,
            periodMonth: latestClosedRun.periodMonth,
            totalNetPay: latestClosedRun.results.reduce((sum, r) => sum + (r.netPay ?? 0), 0),
          }
        : null,
    };
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
