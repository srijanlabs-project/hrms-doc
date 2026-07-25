import { Injectable } from "@nestjs/common";
import type { BenefitEnrollment, BenefitPlan, FlexBasketPolicy, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EnrollmentWithPlan = BenefitEnrollment & { benefitPlan: BenefitPlan };
export type EnrollmentWithEmployeeAndPlan = EnrollmentWithPlan & {
  employee: { id: string; legalName: string; employeeCode: string };
};

const includePlan = { benefitPlan: true } satisfies Prisma.BenefitEnrollmentInclude;
const includeEmployeeAndPlan = {
  ...includePlan,
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.BenefitEnrollmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class BenefitsRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPlan(tenantId: string, data: Omit<Prisma.BenefitPlanUncheckedCreateInput, "tenantId">): Promise<BenefitPlan> {
    return this.prisma.withTenant(tenantId, (tx) => tx.benefitPlan.create({ data: { ...data, tenantId } }));
  }

  listActivePlans(tenantId: string): Promise<BenefitPlan[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitPlan.findMany({ where: { tenantId, isActive: true }, orderBy: { name: "asc" } }),
    );
  }

  listAllPlans(tenantId: string): Promise<BenefitPlan[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.benefitPlan.findMany({ where: { tenantId }, orderBy: { name: "asc" } }));
  }

  findPlanById(tenantId: string, id: string): Promise<BenefitPlan | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.benefitPlan.findFirst({ where: { id, tenantId } }));
  }

  getFlexBasketPolicy(tenantId: string): Promise<FlexBasketPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.flexBasketPolicy.findFirst({ where: { tenantId } }));
  }

  upsertFlexBasketPolicy(tenantId: string, annualAmount: number): Promise<FlexBasketPolicy> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.flexBasketPolicy.upsert({
        where: { tenantId },
        create: { tenantId, annualAmount },
        update: { annualAmount },
      }),
    );
  }

  findEnrollment(tenantId: string, employeeId: string, benefitPlanId: string): Promise<EnrollmentWithPlan | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.findFirst({
        where: { tenantId, employeeId, benefitPlanId },
        include: includePlan,
      }),
    );
  }

  createEnrollment(
    tenantId: string,
    data: { employeeId: string; benefitPlanId: string; effectiveDate: Date; allocatedAmount?: number },
  ): Promise<EnrollmentWithPlan> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.create({ data: { ...data, tenantId }, include: includePlan }),
    );
  }

  updateEnrollment(
    tenantId: string,
    id: string,
    data: Partial<
      Pick<BenefitEnrollment, "status" | "effectiveDate" | "allocatedAmount" | "waiverReason" | "terminatedAt">
    >,
  ): Promise<BenefitEnrollment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.benefitEnrollment.update({ where: { id }, data }));
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<EnrollmentWithPlan[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.findMany({ where: { tenantId, employeeId }, include: includePlan, orderBy: { createdAt: "desc" } }),
    );
  }

  /** Active flex allocations for an employee, excluding a given enrollment (used when re-checking on re-allocation). */
  findActiveFlexAllocations(tenantId: string, employeeId: string, excludeEnrollmentId?: string): Promise<EnrollmentWithPlan[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.findMany({
        where: {
          tenantId,
          employeeId,
          status: "Enrolled",
          id: excludeEnrollmentId ? { not: excludeEnrollmentId } : undefined,
          benefitPlan: { category: "FlexAllowance" },
        },
        include: includePlan,
      }),
    );
  }

  listAllEnrollments(tenantId: string, status?: string): Promise<EnrollmentWithEmployeeAndPlan[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.findMany({
        where: { tenantId, ...(status ? { status } : {}) },
        include: includeEmployeeAndPlan,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findEnrollmentById(tenantId: string, id: string): Promise<EnrollmentWithPlan | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.benefitEnrollment.findFirst({ where: { id, tenantId }, include: includePlan }),
    );
  }
}
