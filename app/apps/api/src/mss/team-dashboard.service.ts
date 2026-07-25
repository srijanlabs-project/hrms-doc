import { Injectable } from "@nestjs/common";
import { AttendanceRepository } from "../attendance/attendance.repository";
import { ExpenseClaimRepository } from "../expense/expense-claim.repository";
import { LeaveRequestRepository } from "../leave/request/leave-request.repository";
import { CurrentEmployeeService } from "../people/current-employee.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { TravelRequestRepository } from "../travel/travel-request.repository";

function todayUtcDate(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export interface PendingApproval {
  id: string;
  sourceType: "Leave" | "Expense" | "Travel";
  employeeName: string;
  title: string;
  submittedAt: Date;
  linkPath: string;
}

/**
 * Manager Self Service — unified Team Dashboard (05-team-dashboard.md v1
 * slice). The spec envisions a fully configurable cockpit with attrition-risk
 * and staffing-gap alerts — no data pipeline exists for those yet. This
 * aggregates what's real: direct-report roster plus pending Leave/Expense/
 * Travel approvals routed to this manager, reusing each module's existing
 * findForApprover() rather than duplicating approval logic. Performance
 * reviews, hiring approvals, and transfers/promotions tiles stay deferred —
 * see 05-manager-self-service/02-04.md.
 */
@Injectable()
export class TeamDashboardService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly leaveRepository: LeaveRequestRepository,
    private readonly expenseRepository: ExpenseClaimRepository,
    private readonly travelRepository: TravelRequestRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly currentEmployee: CurrentEmployeeService,
  ) {}

  async getDashboard() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const [roster, leave, expense, travel] = await Promise.all([
      this.employeeRepository.findByManagerId(tenantId, employee.id),
      this.leaveRepository.findForApprover(tenantId, employee.id, "Pending"),
      this.expenseRepository.findForApprover(tenantId, employee.id),
      this.travelRepository.findForApprover(tenantId, employee.id),
    ]);

    const attendanceToday = roster.length
      ? await this.attendanceRepository.findForEmployeesOnDate(
          tenantId,
          roster.map((e) => e.id),
          todayUtcDate(),
        )
      : [];
    const presentCount = attendanceToday.filter((a) => a.status === "Present").length;

    const pendingApprovals: PendingApproval[] = [
      ...leave.map((r) => ({
        id: r.id,
        sourceType: "Leave" as const,
        employeeName: r.employee.legalName,
        title: `${r.leaveType} Leave (${r.days} day${r.days === 1 ? "" : "s"})`,
        submittedAt: r.createdAt,
        linkPath: "/approvals",
      })),
      ...expense
        .filter((c) => c.status === "Pending")
        .map((c) => ({
          id: c.id,
          sourceType: "Expense" as const,
          employeeName: c.employee.legalName,
          title: `${c.category} Claim (₹${c.amount.toLocaleString("en-IN")})`,
          submittedAt: c.createdAt,
          linkPath: "/expenses",
        })),
      ...travel
        .filter((t) => t.status === "Pending")
        .map((t) => ({
          id: t.id,
          sourceType: "Travel" as const,
          employeeName: t.employee.legalName,
          title: `${t.tripType} Travel to ${t.destination}`,
          submittedAt: t.createdAt,
          linkPath: "/travel",
        })),
    ].sort((a, b) => a.submittedAt.getTime() - b.submittedAt.getTime());

    const oldestPendingApprovalDays = pendingApprovals.length
      ? Math.floor((Date.now() - pendingApprovals[0].submittedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return {
      roster: roster.map((e) => ({
        id: e.id,
        legalName: e.legalName,
        employeeCode: e.employeeCode,
        status: e.status,
        department: e.department?.name ?? null,
      })),
      teamSize: roster.length,
      pendingApprovals,
      pendingApprovalCount: pendingApprovals.length,
      teamAnalytics: {
        attendanceRateToday: roster.length ? Math.round((presentCount / roster.length) * 100) : 0,
        oldestPendingApprovalDays,
      },
    };
  }
}
