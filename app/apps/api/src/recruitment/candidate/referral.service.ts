import { Injectable } from "@nestjs/common";
import { AuthRepository } from "../../auth/auth.repository";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { AppError } from "../../platform/errors/app-error";
import { ValidationAppError } from "../../platform/errors/errors";
import { NotificationService } from "../../notifications/notification.service";
import { RequisitionRepository } from "../requisition/requisition.repository";
import { ApplicationRepository } from "./application.repository";
import { CandidateRepository } from "./candidate.repository";
import type { SubmitReferralDto } from "./dto/submit-referral.dto";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Real catalog gap (Employee Referrals, L3) — not covered by any deep-spec
 * file. Any employee can refer a candidate for a currently Published
 * requisition; this creates a Candidate (source: "Referral",
 * referredByEmployeeId set) and an Application to that requisition in one
 * step, then notifies HR/admins. No referral bonus tracking or payout
 * workflow — that depends on a benefits/payroll linkage this pass doesn't
 * build.
 */
@Injectable()
export class ReferralService {
  constructor(
    private readonly candidateRepository: CandidateRepository,
    private readonly applicationRepository: ApplicationRepository,
    private readonly requisitionRepository: RequisitionRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly authRepository: AuthRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async listOpenRequisitions() {
    const { tenantId } = await this.currentEmployee.resolve();
    return this.requisitionRepository.findPublished(tenantId);
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.candidateRepository.findReferredByEmployee(tenantId, employee.id);
  }

  async submit(dto: SubmitReferralDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();

    const requisition = await this.requisitionRepository.findById(tenantId, dto.requisitionId);
    if (!requisition || requisition.status !== "Published") {
      throw new ValidationAppError([
        { field: "requisitionId", code: "NOT_OPEN", message: "This requisition is not open for referrals." },
      ]);
    }

    let candidate;
    try {
      candidate = await this.candidateRepository.create(tenantId, {
        fullName: dto.fullName,
        email: dto.email,
        source: "Referral",
        referredByEmployeeId: employee.id,
      });
    } catch {
      throw new AppError({
        errorRef: "ERR-REFERRAL-001",
        code: "REFERRAL-001",
        category: "state-conflict",
        severity: "medium",
        httpStatus: 409,
        message: `A candidate with email "${dto.email}" already exists.`,
        retryable: false,
        tenantSafe: true,
        objectRef: "OBJ-CANDIDATE",
      });
    }

    const application = await this.applicationRepository.create(tenantId, dto.requisitionId, candidate.id);

    const admins = await this.authRepository.findUsersWithAnyRole(tenantId, ADMIN_ROLES);
    await Promise.all(
      admins.map((admin) =>
        this.notificationService.notify(tenantId, admin.id, {
          type: "recruitment.referral.submitted",
          title: "New employee referral",
          body: `${employee.legalName} referred ${dto.fullName} for "${requisition.title}".`,
          linkPath: "/recruitment",
        }),
      ),
    );

    return { candidate, application };
  }
}
