import { Injectable } from "@nestjs/common";
import type {
  EmployeeRotationAssignment,
  Prisma,
  ShiftDefinition,
  ShiftRotationPattern,
  ShiftRotationStep,
} from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type PatternWithSteps = ShiftRotationPattern & { steps: (ShiftRotationStep & { shift: ShiftDefinition })[] };
export type RotationAssignmentWithPattern = EmployeeRotationAssignment & { pattern: PatternWithSteps };

const includeSteps = {
  steps: { include: { shift: true }, orderBy: { weekIndex: "asc" } },
} satisfies Prisma.ShiftRotationPatternInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RotationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPatternByName(tenantId: string, name: string): Promise<ShiftRotationPattern | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.shiftRotationPattern.findFirst({ where: { tenantId, name } }));
  }

  /** Creates the pattern and its ordered steps in one transaction. */
  createPattern(tenantId: string, name: string, shiftIds: string[]): Promise<PatternWithSteps> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftRotationPattern.create({
        data: {
          tenantId,
          name,
          cadenceWeeks: shiftIds.length,
          steps: {
            create: shiftIds.map((shiftId, weekIndex) => ({ tenantId, weekIndex, shiftId })),
          },
        },
        include: includeSteps,
      }),
    );
  }

  listPatterns(tenantId: string): Promise<PatternWithSteps[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftRotationPattern.findMany({ where: { tenantId }, include: includeSteps, orderBy: { name: "asc" } }),
    );
  }

  findPatternById(tenantId: string, id: string): Promise<PatternWithSteps | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.shiftRotationPattern.findFirst({ where: { id, tenantId }, include: includeSteps }),
    );
  }

  /** Closes any currently-open rotation assignment for the employee, then creates the new one, in one transaction. */
  async assign(
    tenantId: string,
    data: { employeeId: string; patternId: string; anchorWeekStart: Date; effectiveFrom: Date },
  ): Promise<RotationAssignmentWithPattern> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const dayBefore = new Date(data.effectiveFrom);
      dayBefore.setUTCDate(dayBefore.getUTCDate() - 1);

      await tx.employeeRotationAssignment.updateMany({
        where: { tenantId, employeeId: data.employeeId, effectiveTo: null },
        data: { effectiveTo: dayBefore },
      });

      return tx.employeeRotationAssignment.create({
        data: { ...data, tenantId },
        include: { pattern: { include: includeSteps } },
      });
    });
  }

  findActiveForEmployee(tenantId: string, employeeId: string): Promise<RotationAssignmentWithPattern | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeRotationAssignment.findFirst({
        where: { tenantId, employeeId, effectiveTo: null },
        include: { pattern: { include: includeSteps } },
        orderBy: { effectiveFrom: "desc" },
      }),
    );
  }
}
