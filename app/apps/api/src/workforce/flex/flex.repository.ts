import { Injectable } from "@nestjs/common";
import type { EmployeeFlexAssignment, FlexibleHoursPolicy, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type FlexAssignmentWithPolicy = EmployeeFlexAssignment & { policy: FlexibleHoursPolicy };

const includePolicy = { policy: true } satisfies Prisma.EmployeeFlexAssignmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class FlexRepository {
  constructor(private readonly prisma: PrismaService) {}

  createPolicy(tenantId: string, data: Omit<Prisma.FlexibleHoursPolicyUncheckedCreateInput, "tenantId">): Promise<FlexibleHoursPolicy> {
    return this.prisma.withTenant(tenantId, (tx) => tx.flexibleHoursPolicy.create({ data: { ...data, tenantId } }));
  }

  findPolicyByName(tenantId: string, name: string): Promise<FlexibleHoursPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.flexibleHoursPolicy.findFirst({ where: { tenantId, name } }));
  }

  listPolicies(tenantId: string): Promise<FlexibleHoursPolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.flexibleHoursPolicy.findMany({ where: { tenantId }, orderBy: { name: "asc" } }));
  }

  /** Closes any currently-open assignment for the employee, then creates the new one, in one transaction. */
  async assign(
    tenantId: string,
    data: { employeeId: string; policyId: string; effectiveFrom: Date },
  ): Promise<FlexAssignmentWithPolicy> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const dayBefore = new Date(data.effectiveFrom);
      dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);

      await tx.employeeFlexAssignment.updateMany({
        where: { tenantId, employeeId: data.employeeId, effectiveTo: null },
        data: { effectiveTo: dayBefore },
      });

      return tx.employeeFlexAssignment.create({ data: { ...data, tenantId }, include: includePolicy });
    });
  }

  findActiveForEmployee(tenantId: string, employeeId: string): Promise<FlexAssignmentWithPolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeFlexAssignment.findFirst({
        where: { tenantId, employeeId, effectiveTo: null },
        include: includePolicy,
        orderBy: { effectiveFrom: "desc" },
      }),
    );
  }
}
