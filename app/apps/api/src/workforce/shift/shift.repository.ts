import { Injectable } from "@nestjs/common";
import type { Prisma, ShiftAssignment, ShiftDefinition } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type ShiftAssignmentWithShift = ShiftAssignment & { shift: ShiftDefinition };

const includeShift = { shift: true } satisfies Prisma.ShiftAssignmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ShiftRepository {
  constructor(private readonly prisma: PrismaService) {}

  createShift(tenantId: string, data: Omit<Prisma.ShiftDefinitionUncheckedCreateInput, "tenantId">) {
    return this.prisma.withTenant(tenantId, (tx) => tx.shiftDefinition.create({ data: { ...data, tenantId } }));
  }

  findShiftByCode(tenantId: string, code: string): Promise<ShiftDefinition | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.shiftDefinition.findFirst({ where: { tenantId, code } }));
  }

  findShiftById(tenantId: string, id: string): Promise<ShiftDefinition | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.shiftDefinition.findFirst({ where: { id, tenantId } }));
  }

  listShifts(tenantId: string): Promise<ShiftDefinition[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftDefinition.findMany({ where: { tenantId }, orderBy: { code: "asc" } }),
    );
  }

  /** Closes any currently-open assignment for the employee, then creates the new one, in one transaction. */
  async assign(
    tenantId: string,
    data: { employeeId: string; shiftId: string; effectiveFrom: Date },
  ): Promise<ShiftAssignmentWithShift> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const dayBefore = new Date(data.effectiveFrom);
      dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);

      await tx.shiftAssignment.updateMany({
        where: { tenantId, employeeId: data.employeeId, effectiveTo: null },
        data: { effectiveTo: dayBefore },
      });

      return tx.shiftAssignment.create({
        data: { ...data, tenantId },
        include: includeShift,
      });
    });
  }

  findActiveForEmployee(tenantId: string, employeeId: string): Promise<ShiftAssignmentWithShift | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftAssignment.findFirst({
        where: { tenantId, employeeId, effectiveTo: null },
        include: includeShift,
        orderBy: { effectiveFrom: "desc" },
      }),
    );
  }

  /** All employees' current (effectiveTo null) assignment — admin roster/coverage view. */
  listAllActive(tenantId: string): Promise<
    (ShiftAssignmentWithShift & { employee: { id: string; legalName: string; employeeCode: string } })[]
  > {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftAssignment.findMany({
        where: { tenantId, effectiveTo: null },
        include: { shift: true, employee: { select: { id: true, legalName: true, employeeCode: true } } },
        orderBy: { effectiveFrom: "desc" },
      }),
    );
  }
}
