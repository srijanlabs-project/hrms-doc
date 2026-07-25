import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { RequestContextService } from "../../platform/context/request-context.service";
import { ForbiddenAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CareerRepository } from "../career/career.repository";
import { EmployeeRepository } from "../employee/employee.repository";
import { SalaryRevisionRepository } from "../salary-revision/salary-revision.repository";

interface TimelineEvent {
  date: string;
  type: string;
  title: string;
  detail?: string;
}

/**
 * v1 slice of docs/08-submodule-specifications/02-people-management/15-employee-timeline.md:
 * a read-only, computed assembly over the real Employee/assignment-history/
 * probation/salary-revision/contract-renewal tables — not a separate
 * event-ingestion/visibility-rule engine, mirroring the same
 * computed-assembly pattern as the Organization Management pass's org-tree
 * endpoint. No event redaction/suppression rules — every event returned is
 * visible to anyone who can already view this employee's profile.
 */
@Injectable()
export class TimelineService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly careerRepository: CareerRepository,
    private readonly salaryRevisionRepository: SalaryRevisionRepository,
    private readonly authRepository: AuthRepository,
    private readonly requestContext: RequestContextService,
  ) {}

  async getTimeline(employeeId: string): Promise<TimelineEvent[]> {
    const tenantId = await this.assertSelfOrAdmin(employeeId);
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }

    const [career, salaryRevisions] = await Promise.all([
      this.careerRepository.findAll(tenantId, employeeId),
      this.salaryRevisionRepository.findForEmployee(tenantId, employeeId),
    ]);

    const events: TimelineEvent[] = [];

    if (employee.joiningDate) {
      events.push({ date: employee.joiningDate.toISOString(), type: "Joining", title: "Joined the organization" });
    }

    for (const movement of career.assignmentHistory) {
      events.push({
        date: movement.effectiveDate.toISOString(),
        type: movement.changeType,
        title: `${movement.changeType}`,
        detail: movement.reason ?? undefined,
      });
    }

    for (const probation of career.probationRecords) {
      if (probation.decisionDate) {
        events.push({
          date: probation.decisionDate.toISOString(),
          type: "Probation",
          title: `Probation ${probation.status}`,
          detail: probation.decisionNote ?? undefined,
        });
      }
    }

    for (const revision of salaryRevisions) {
      if (revision.appliedAt) {
        events.push({
          date: revision.appliedAt.toISOString(),
          type: "SalaryRevision",
          title: `Salary revised to ₹${revision.proposedMonthlyBasic.toLocaleString("en-IN")}`,
          detail: revision.reason ?? undefined,
        });
      }
    }

    for (const renewal of career.contractRenewals) {
      events.push({
        date: renewal.createdAt.toISOString(),
        type: "ContractRenewal",
        title: `Contract renewed to ${new Date(renewal.newEndDate).toLocaleDateString("en-IN")}`,
        detail: renewal.note ?? undefined,
      });
    }

    if (employee.lastWorkingDay) {
      events.push({
        date: employee.lastWorkingDay.toISOString(),
        type: "Exit",
        title: "Separated from the organization",
        detail: employee.exitReason ?? undefined,
      });
    }

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private async assertSelfOrAdmin(employeeId: string): Promise<string> {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    const employee = await this.employeeRepository.findById(tenantId, employeeId);
    if (!employee) {
      throw new NotFoundAppError("OBJ-EMPLOYEE", "Employee not found.");
    }
    const user = await this.authRepository.findUserById(tenantId, userId);
    const isSelf = user?.employeeId === employeeId;
    const isAdmin = !!user?.roles.some((role) => role === "org_admin" || role === "hr_ops");
    if (!isSelf && !isAdmin) {
      throw new ForbiddenAppError(this.requestContext.correlationId);
    }
    return tenantId;
  }
}
