import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Prisma } from "@prisma/client";
import { AuthRepository } from "../../auth/auth.repository";
import { EmployeeRepository } from "../../people/employee/employee.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { NotificationService } from "../../notifications/notification.service";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { RequestContextService } from "../../platform/context/request-context.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError } from "../../platform/errors/errors";
import { CourseRepository } from "../course/course.repository";
import { EnrollmentRepository } from "./enrollment.repository";

const GRACE_PERIOD_DAYS = 30;

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-ENROLLMENT-001",
    code: "ENROLLMENT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-ENROLLMENT",
    details: { currentState },
  });
}

function monthsBetween(from: Date, to: Date): number {
  return (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
}

/**
 * v1 slice of docs/08-submodule-specifications/12-learning-and-development/
 * {01-learning-management-system,03-compliance-training}.md: self-enrollment
 * into a Published course, plus a daily sweep (reusing the Scheduler-engine
 * cron pattern from ComplianceCalendarService) that assigns every Active
 * employee to every Published mandatory course, flips overdue assignments,
 * and escalates to the employee's manager. No exemptions/waivers, no
 * equivalency mapping, no LMS-integration completion sources — recurrence
 * resets the same enrollment row rather than logging separate cycles.
 */
@Injectable()
export class EnrollmentService {
  private readonly logger = new Logger(EnrollmentService.name);

  constructor(
    private readonly repository: EnrollmentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
    private readonly prisma: PrismaService,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async enroll(courseId: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const course = await this.courseRepository.findById(tenantId, courseId);
    if (!course) {
      throw new NotFoundAppError("OBJ-COURSE", "Course not found.");
    }
    if (course.status !== "Published") {
      throw stateConflict("Only a Published course can be enrolled into.", course.status);
    }
    try {
      return await this.repository.create(tenantId, employee.id, courseId);
    } catch (err) {
      if (!(err instanceof Prisma.PrismaClientKnownRequestError) || err.code !== "P2002") {
        throw err;
      }
      throw stateConflict("You are already enrolled in this course.", "Duplicate");
    }
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  /** Direct reports' mandatory training — how a manager sees escalation risk. */
  async listTeamMandatory() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const reports = await this.employeeRepository.findByManagerId(tenantId, employee.id);
    if (reports.length === 0) return [];
    return this.repository.findForEmployees(
      tenantId,
      reports.map((r) => r.id),
    );
  }

  async complete(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const enrollment = await this.findOwnedOrThrow(tenantId, employee.id, id);
    if (enrollment.status !== "Enrolled" && enrollment.status !== "Overdue") {
      throw stateConflict("Only an active enrollment can be marked complete.", enrollment.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Completed", completedAt: new Date() });
  }

  async withdraw(id: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const enrollment = await this.findOwnedOrThrow(tenantId, employee.id, id);
    if (enrollment.status !== "Enrolled") {
      throw stateConflict("Only an active enrollment can be withdrawn.", enrollment.status);
    }
    return this.repository.updateStatus(tenantId, id, { status: "Withdrawn" });
  }

  /** Cron entry point — every tenant, every night. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runDailyForAllTenants(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.runForTenant(tenantId);
    }
  }

  /** Ops "run now" trigger — always scoped to the caller's own tenant. */
  async runNow(): Promise<void> {
    const { tenantId } = this.requireAuthenticated();
    await this.runForTenant(tenantId);
  }

  async runForTenant(tenantId: string): Promise<void> {
    await this.assignMandatoryCourses(tenantId);
    await this.sweepOverdue(tenantId);
    await this.sendEscalations(tenantId);
  }

  private async assignMandatoryCourses(tenantId: string): Promise<void> {
    const courses = await this.courseRepository.findPublishedMandatory(tenantId);
    const employees = await this.employeeRepository.findActive(tenantId);
    const dueDate = new Date(Date.now() + GRACE_PERIOD_DAYS * 86_400_000);

    let assigned = 0;
    for (const course of courses) {
      for (const employee of employees) {
        const existing = await this.repository.findByEmployeeAndCourse(tenantId, employee.id, course.id);
        if (!existing) {
          await this.repository.create(tenantId, employee.id, course.id, { dueDate, assignedAutomatically: true });
          assigned++;
        } else if (
          existing.assignedAutomatically &&
          existing.status === "Completed" &&
          course.recurrenceMonths &&
          existing.completedAt &&
          monthsBetween(existing.completedAt, new Date()) >= course.recurrenceMonths
        ) {
          await this.repository.updateStatus(tenantId, existing.id, { status: "Enrolled", completedAt: null, dueDate });
          assigned++;
        }
      }
    }
    this.logger.log(`Tenant ${tenantId}: assigned/renewed ${assigned} mandatory training enrollment(s).`);
  }

  private async sweepOverdue(tenantId: string): Promise<void> {
    const enrolled = await this.repository.findAssignedEnrolled(tenantId);
    const now = new Date();
    let overdue = 0;
    for (const e of enrolled) {
      if (e.dueDate && e.dueDate < now) {
        await this.repository.updateStatus(tenantId, e.id, { status: "Overdue" });
        overdue++;
      }
    }
    this.logger.log(`Tenant ${tenantId}: marked ${overdue} mandatory enrollment(s) overdue.`);
  }

  private async sendEscalations(tenantId: string): Promise<void> {
    const overdue = await this.repository.findOverdue(tenantId);
    for (const enrollment of overdue) {
      const employeeUser = await this.authRepository.findUserByEmployeeId(tenantId, enrollment.employeeId);
      if (employeeUser) {
        await this.notificationService.notify(tenantId, employeeUser.id, {
          type: "learning.mandatory.overdue",
          title: "Mandatory training overdue",
          body: `"${enrollment.course.title}" is overdue.`,
          linkPath: "/learning/my",
        });
      }

      const employee = await this.employeeRepository.findById(tenantId, enrollment.employeeId);
      if (!employee?.managerId) continue;
      const managerUser = await this.authRepository.findUserByEmployeeId(tenantId, employee.managerId);
      if (managerUser) {
        await this.notificationService.notify(tenantId, managerUser.id, {
          type: "learning.mandatory.overdue.escalation",
          title: "Direct report has overdue mandatory training",
          body: `${employee.legalName} has not completed "${enrollment.course.title}", which is overdue.`,
          linkPath: "/learning/team",
        });
      }
    }
  }

  private async findOwnedOrThrow(tenantId: string, employeeId: string, id: string) {
    const enrollment = await this.repository.findById(tenantId, id);
    if (!enrollment || enrollment.employeeId !== employeeId) {
      throw new NotFoundAppError("OBJ-ENROLLMENT", "Enrollment not found.");
    }
    return enrollment;
  }

  private requireAuthenticated(): { tenantId: string } {
    const { tenantId } = this.requestContext.store ?? {};
    if (!tenantId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId };
  }
}
