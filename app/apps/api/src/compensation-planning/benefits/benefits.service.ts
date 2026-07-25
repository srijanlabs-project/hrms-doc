import { Injectable } from "@nestjs/common";
import { CurrentEmployeeService } from "../../people/current-employee.service";
import { AppError } from "../../platform/errors/app-error";
import { AuthenticationAppError, NotFoundAppError, ValidationAppError } from "../../platform/errors/errors";
import { RequestContextService } from "../../platform/context/request-context.service";
import { PayComponentRepository } from "../../payroll/pay-component/pay-component.repository";
import { BenefitsRepository, type EnrollmentWithPlan } from "./benefits.repository";
import type { CreateBenefitPlanDto } from "./dto/create-plan.dto";
import type { EnrollBenefitDto } from "./dto/enroll.dto";

function stateConflict(message: string, currentState: string) {
  return new AppError({
    errorRef: "ERR-BENEFIT-001",
    code: "BENEFIT-001",
    category: "state-conflict",
    severity: "medium",
    httpStatus: 409,
    message,
    retryable: false,
    tenantSafe: true,
    objectRef: "OBJ-BENEFIT-ENROLLMENT",
    details: { currentState },
  });
}

/**
 * v1 slice of 04-benefits-administration.md + 05-flexible-benefits.md,
 * built as one vertical: standard plans (Insurance/Retirement/Wellness)
 * carry a fixed employee/employer cost; FlexAllowance plans let an employee
 * allocate an annual amount up to a per-plan cap and a tenant-wide basket
 * cap. Enrolling creates a real PayComponent + EmployeePayComponent
 * assignment (reusing the Payroll engine from E09) so elections genuinely
 * affect the next payroll run — no separate deduction/allowance mechanism.
 * No dependents, life events, vendor batches, or proof/reimbursement
 * tracking — no real vendor integration point exists in this environment.
 */
@Injectable()
export class BenefitsService {
  constructor(
    private readonly repository: BenefitsRepository,
    private readonly payComponentRepository: PayComponentRepository,
    private readonly currentEmployee: CurrentEmployeeService,
    private readonly requestContext: RequestContextService,
  ) {}

  async createPlan(dto: CreateBenefitPlanDto) {
    const { tenantId } = this.requireAuthenticated();
    try {
      return await this.repository.createPlan(tenantId, dto);
    } catch {
      throw new ValidationAppError([
        { field: "code", code: "DUPLICATE", message: `A benefit plan with code "${dto.code}" already exists.` },
      ]);
    }
  }

  async listActivePlans() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listActivePlans(tenantId);
  }

  async listAllPlans() {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAllPlans(tenantId);
  }

  async setFlexBasket(annualAmount: number) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.upsertFlexBasketPolicy(tenantId, annualAmount);
  }

  async getFlexBasketStatus() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const policy = await this.repository.getFlexBasketPolicy(tenantId);
    const allocations = await this.repository.findActiveFlexAllocations(tenantId, employee.id);
    const allocated = allocations.reduce((sum, a) => sum + (a.allocatedAmount ?? 0), 0);
    return {
      annualAmount: policy?.annualAmount ?? null,
      allocated,
      remaining: policy ? policy.annualAmount - allocated : null,
    };
  }

  async listMine() {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    return this.repository.findForEmployee(tenantId, employee.id);
  }

  async listAllEnrollments(status?: string) {
    const { tenantId } = this.requireAuthenticated();
    return this.repository.listAllEnrollments(tenantId, status);
  }

  async enroll(dto: EnrollBenefitDto) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const plan = await this.repository.findPlanById(tenantId, dto.benefitPlanId);
    if (!plan || !plan.isActive) {
      throw new NotFoundAppError("OBJ-BENEFIT-PLAN", "Benefit plan not found or inactive.");
    }

    const isFlex = plan.category === "FlexAllowance";
    if (isFlex) {
      await this.validateFlexAllocation(tenantId, employee.id, plan, dto.allocatedAmount);
    }

    const existing = await this.repository.findEnrollment(tenantId, employee.id, dto.benefitPlanId);
    if (existing && existing.status === "Enrolled") {
      throw stateConflict("You are already enrolled in this plan.", existing.status);
    }

    const monthlyAmount = isFlex ? (dto.allocatedAmount ?? 0) / 12 : plan.employeeCost;
    const payComponent = await this.ensurePayComponent(tenantId, plan.id, plan.code, plan.name, isFlex);
    await this.payComponentRepository.assign(tenantId, {
      employeeId: employee.id,
      payComponentId: payComponent.id,
      value: monthlyAmount,
    });

    const effectiveDate = new Date(dto.effectiveDate);
    if (existing) {
      return this.repository.updateEnrollment(tenantId, existing.id, {
        status: "Enrolled",
        effectiveDate,
        allocatedAmount: isFlex ? dto.allocatedAmount : undefined,
        waiverReason: null,
        terminatedAt: null,
      });
    }
    return this.repository.createEnrollment(tenantId, {
      employeeId: employee.id,
      benefitPlanId: dto.benefitPlanId,
      effectiveDate,
      allocatedAmount: isFlex ? dto.allocatedAmount : undefined,
    });
  }

  async waive(id: string, reason: string) {
    const { tenantId, employee } = await this.currentEmployee.resolve();
    const enrollment = await this.findOwnedOrThrow(tenantId, employee.id, id);
    if (enrollment.status !== "Enrolled") {
      throw stateConflict(`This enrollment is already ${enrollment.status.toLowerCase()}.`, enrollment.status);
    }
    const payComponentCode = `BEN-${enrollment.benefitPlan.code}`;
    const payComponent = await this.payComponentRepository.findComponentByCode(tenantId, payComponentCode);
    if (payComponent) {
      await this.payComponentRepository.setActive(tenantId, employee.id, payComponent.id, false);
    }
    return this.repository.updateEnrollment(tenantId, id, { status: "Waived", waiverReason: reason });
  }

  async terminate(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const enrollment = await this.repository.findEnrollmentById(tenantId, id);
    if (!enrollment) {
      throw new NotFoundAppError("OBJ-BENEFIT-ENROLLMENT", "Enrollment not found.");
    }
    if (enrollment.status !== "Enrolled") {
      throw stateConflict(`This enrollment is already ${enrollment.status.toLowerCase()}.`, enrollment.status);
    }
    const payComponentCode = `BEN-${enrollment.benefitPlan.code}`;
    const payComponent = await this.payComponentRepository.findComponentByCode(tenantId, payComponentCode);
    if (payComponent) {
      await this.payComponentRepository.setActive(tenantId, enrollment.employeeId, payComponent.id, false);
    }
    return this.repository.updateEnrollment(tenantId, id, { status: "Terminated", terminatedAt: new Date() });
  }

  private async validateFlexAllocation(
    tenantId: string,
    employeeId: string,
    plan: { id: string; maxAnnualAllocation: number | null },
    allocatedAmount: number | undefined,
  ) {
    if (allocatedAmount == null) {
      throw new ValidationAppError([
        { field: "allocatedAmount", code: "REQUIRED", message: "An allocation amount is required for flex allowance plans." },
      ]);
    }
    if (plan.maxAnnualAllocation != null && allocatedAmount > plan.maxAnnualAllocation) {
      throw new ValidationAppError([
        {
          field: "allocatedAmount",
          code: "EXCEEDS_MAX",
          message: `This plan allows a maximum annual allocation of ${plan.maxAnnualAllocation}.`,
        },
      ]);
    }
    const policy = await this.repository.getFlexBasketPolicy(tenantId);
    if (!policy) return;
    const existingAllocations = await this.repository.findActiveFlexAllocations(tenantId, employeeId, undefined);
    const otherTotal = existingAllocations
      .filter((a) => a.benefitPlanId !== plan.id)
      .reduce((sum, a) => sum + (a.allocatedAmount ?? 0), 0);
    if (otherTotal + allocatedAmount > policy.annualAmount) {
      throw new ValidationAppError([
        {
          field: "allocatedAmount",
          code: "EXCEEDS_BASKET",
          message: `This allocation would exceed your annual flex basket of ${policy.annualAmount} (${otherTotal} already allocated).`,
        },
      ]);
    }
  }

  private async ensurePayComponent(tenantId: string, planId: string, code: string, name: string, isFlex: boolean) {
    const componentCode = `BEN-${code}`;
    const existing = await this.payComponentRepository.findComponentByCode(tenantId, componentCode);
    if (existing) return existing;
    return this.payComponentRepository.createComponent(tenantId, {
      code: componentCode,
      name: `Benefit: ${name}`,
      type: isFlex ? "Earning" : "Deduction",
      calculationMethod: "FixedAmount",
      defaultValue: 0,
      isActive: true,
    });
  }

  private async findOwnedOrThrow(tenantId: string, employeeId: string, id: string): Promise<EnrollmentWithPlan> {
    const enrollment = await this.repository.findEnrollmentById(tenantId, id);
    if (!enrollment || enrollment.employeeId !== employeeId) {
      throw new NotFoundAppError("OBJ-BENEFIT-ENROLLMENT", "Enrollment not found.");
    }
    return enrollment;
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
