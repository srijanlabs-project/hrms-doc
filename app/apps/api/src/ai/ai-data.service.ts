import { Injectable } from "@nestjs/common";
import { WorkforceAnalyticsService } from "../analytics/workforce/workforce-analytics.service";
import { AttendanceService } from "../attendance/attendance.service";
import { RecognitionService } from "../experience/recognition/recognition.service";
import { EnrollmentService } from "../learning/enrollment/enrollment.service";
import { LeaveBalanceService } from "../leave/balance/leave-balance.service";
import { TeamDashboardService } from "../mss/team-dashboard.service";
import { PayslipService } from "../payroll/payslip/payslip.service";
import { EmployeeRepository } from "../people/employee/employee.repository";
import { RequestContextService } from "../platform/context/request-context.service";
import { NotFoundAppError } from "../platform/errors/errors";
import { ApplicationRepository } from "../recruitment/candidate/application.repository";
import { OfferRepository } from "../recruitment/offer/offer.repository";
import { RequisitionRepository } from "../recruitment/requisition/requisition.repository";
import { SuccessionService } from "../talent/succession/succession.service";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** True for the "your account isn't linked to an employee record" case CurrentEmployeeService throws — every manager/self-service tool below hits this for a non-employee caller (e.g. the platform-provisioning bootstrap admin), and should degrade to an empty/friendly answer rather than a 404. */
function isNoEmployeeError(err: unknown): boolean {
  return err instanceof NotFoundAppError;
}

/**
 * Real tenant-data lookups Ridz can answer from — the "tools" layer that any
 * AiProvider (dev stand-in or a real Claude integration) draws on. Reuses
 * the exact same self-service logic as the Attendance/Leave/Payroll pages
 * (CurrentEmployeeService under the hood), so an answer is never out of
 * sync with what the employee sees on those pages themselves.
 *
 * W5·E26 deepening: the manager/org-insight methods below reuse
 * WorkforceAnalyticsService, TeamDashboardService, SuccessionService,
 * RecognitionService, and EnrollmentService exactly as-is — no new
 * prediction/ML/vector-store infrastructure, just a wider real-data tool
 * surface (per the E26 scoping research: Policy Assistant, Attrition/
 * Flight-Risk Prediction, Skills Graph, and AI Workforce Planning all need
 * infrastructure — a document corpus, trained models, a skills taxonomy —
 * that doesn't exist in this tenant and stays deferred).
 */
@Injectable()
export class AiDataService {
  constructor(
    private readonly leaveBalanceService: LeaveBalanceService,
    private readonly attendanceService: AttendanceService,
    private readonly payslipService: PayslipService,
    private readonly employeeRepository: EmployeeRepository,
    private readonly workforceAnalyticsService: WorkforceAnalyticsService,
    private readonly teamDashboardService: TeamDashboardService,
    private readonly successionService: SuccessionService,
    private readonly recognitionService: RecognitionService,
    private readonly enrollmentService: EnrollmentService,
    private readonly requestContext: RequestContextService,
    private readonly requisitionRepository: RequisitionRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly offerRepository: OfferRepository,
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

  /** Same aggregate the Workforce Analytics page charts — headcount/attrition trend, unrestricted by role like getHeadcount above. */
  async getWorkforceTrendSummary(): Promise<{ headcount: number; separations: number; attritionRate: number } | null> {
    const points = await this.workforceAnalyticsService.getTrend(3);
    const latest = points.at(-1);
    return latest ? { headcount: latest.headcount, separations: latest.separations, attritionRate: latest.attritionRate } : null;
  }

  /** Empty for a non-manager, same as getTeamAttendanceToday — self-limiting, no role check needed. */
  async getPendingApprovalsSummary(): Promise<{ count: number; oldestDays: number } | null> {
    try {
      const { pendingApprovals, teamAnalytics } = await this.teamDashboardService.getDashboard();
      return { count: pendingApprovals.length, oldestDays: teamAnalytics.oldestPendingApprovalDays };
    } catch (err) {
      if (isNoEmployeeError(err)) return null;
      throw err;
    }
  }

  /** Confidential per SuccessionService's own doc comment (org_admin/hr_ops only, no employee self-service view) — gated here since AiService bypasses the controller-level @Roles that normally enforces this. */
  async getSuccessionCoverageSummary(): Promise<{ total: number; covered: number; uncoveredTitles: string[] } | "restricted"> {
    const roles = this.requestContext.roles;
    if (!ADMIN_ROLES.some((role) => roles.includes(role))) {
      return "restricted";
    }
    const roleRecords = await this.successionService.listRoles(true);
    const uncovered = roleRecords.filter((r) => !r.hasReadyCoverage);
    return { total: roleRecords.length, covered: roleRecords.length - uncovered.length, uncoveredTitles: uncovered.map((r) => r.title) };
  }

  async getRecognitionSummary(): Promise<{ received: number; given: number } | null> {
    try {
      const [received, given] = await Promise.all([
        this.recognitionService.listReceivedByMe(),
        this.recognitionService.listGivenByMe(),
      ]);
      return { received: received.length, given: given.length };
    } catch (err) {
      if (isNoEmployeeError(err)) return null;
      throw err;
    }
  }

  /**
   * Recruiter copilot (W5·P gap closure). No dedicated "recruiter" role
   * exists in this build (only org_admin/hr_ops/manager), so this is gated
   * the same way succession coverage is — org_admin/hr_ops only — rather
   * than left open to every manager, since requisition compensation bands
   * and full pipeline detail aren't something every manager should see
   * company-wide.
   */
  async getRecruitingPipelineSummary(): Promise<
    { openRequisitions: number; activePipelineCandidates: number; offersPendingDecision: number } | "restricted"
  > {
    const roles = this.requestContext.roles;
    if (!ADMIN_ROLES.some((role) => roles.includes(role))) {
      return "restricted";
    }
    const tenantId = this.requestContext.tenantId!;
    const [requisitions, stageCounts, offers] = await Promise.all([
      this.requisitionRepository.findAll(tenantId),
      this.applicationRepository.countByStage(tenantId),
      this.offerRepository.findAll(tenantId),
    ]);
    const openRequisitions = requisitions.filter((r) => r.status === "Published").length;
    const activePipelineCandidates = Object.entries(stageCounts)
      .filter(([stage]) => stage !== "Rejected" && stage !== "Hired")
      .reduce((sum, [, count]) => sum + count, 0);
    const offersPendingDecision = offers.filter((o) => o.status === "PendingApproval" || o.status === "Approved" || o.status === "Issued").length;
    return { openRequisitions, activePipelineCandidates, offersPendingDecision };
  }

  /** Empty for a non-manager — same self-limiting pattern as pending approvals/team attendance. */
  async getTeamLearningGapSummary(): Promise<{ incomplete: { employeeName: string; courseTitle: string }[] } | null> {
    try {
      const enrollments = await this.enrollmentService.listTeamMandatory();
      const incomplete = enrollments
        .filter((e) => e.status !== "Completed")
        .map((e) => ({ employeeName: e.employee.legalName, courseTitle: e.course.title }));
      return { incomplete };
    } catch (err) {
      if (isNoEmployeeError(err)) return null;
      throw err;
    }
  }
}
