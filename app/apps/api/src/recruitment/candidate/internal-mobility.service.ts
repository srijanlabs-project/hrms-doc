import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { AppError } from "../../platform/errors/app-error";
import { ValidationAppError } from "../../platform/errors/errors";
import { NotificationService } from "../../notifications/notification.service";
import { RequisitionRepository } from "../requisition/requisition.repository";
import { ApplicationRepository } from "./application.repository";
import { CandidateRepository } from "./candidate.repository";
import type { SubmitInternalApplicationDto } from "./dto/submit-internal-application.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Internal Mobility (Recruitment and ATS, real catalog gap — no dedicated
 * spec file). Reuses the exact Requisition/Candidate/Application/Offer
 * pipeline that the external and referral flows already use — Internal
 * Mobility is a visibility and identity variant, not a parallel entity set.
 * `Requisition.isInternal` marks an opening visible on the internal jobs
 * board; applying reuses (or creates once) the employee's own Candidate row
 * via Candidate.employeeId, tagged source "Internal", so an employee's
 * second internal application doesn't collide with the email-uniqueness
 * constraint the Referral flow already relies on.
 */
@Injectable()
export class InternalMobilityService {
  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly requisitionRepository: RequisitionRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async listOpenings() {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.requisitionRepository.findPublishedInternal(tenantId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.candidateRepository.findInternalMobilityByEmployee(tenantId, employee.id);
  }

  async apply(dto: SubmitInternalApplicationDto) {
    const { tenantId, employee, userId } = await this.currentEmployee.resolve();

    const requisition = await this.requisitionRepository.findById(tenantId, dto.requisitionId);
    if (!requisition || requisition.status !== "Published" || !requisition.isInternal) {
      throw new ValidationAppError([
        { field: "requisitionId", code: "NOT_OPEN", message: "This opening is not open for internal applications." },
      ]);
    }

    let candidate = await this.candidateRepository.findByEmployeeId(tenantId, employee.id);
    if (!candidate) {
      const user = await this.authRepository.findUserById(tenantId, userId);
      candidate = await this.candidateRepository.create(tenantId, {
        fullName: employee.legalName,
        email: user?.email ?? `${employee.employeeCode}@internal.staffsy`,
        source: "Internal",
        employeeId: employee.id,
      });
    }

    let application;
    try {
      application = await this.applicationRepository.create(tenantId, dto.requisitionId, candidate.id);
    } catch {
      throw new AppError({
        errorRef: "ERR-INTERNAL-MOBILITY-001",
        code: "INTERNAL-MOBILITY-001",
        category: "state-conflict",
        severity: "medium",
        httpStatus: 409,
        message: "You have already applied to this opening.",
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-APPLICATION",
      });
    }

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.map((admin) =>
        this.notificationService.notify(tenantId, admin.id, {
          type: "recruitment.internal-mobility.applied",
          title: "New internal application",
          body: `${employee.legalName} applied internally for "${requisition.title}".`,
          linkPath: "/recruitment",
        }),
      ),
    );

    return { candidate, application };
  }
}
