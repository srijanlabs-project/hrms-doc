import { Injectable } from "@nestjs/common";
import type { Appraisal, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type AppraisalWithEmployee = Appraisal & {
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
};

const includeEmployee = {
  employee: { select: { id: true, legalName: true, employeeCode: true, managerId: true } },
} satisfies Prisma.AppraisalInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AppraisalRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, employeeId: string, periodYear: number): Promise<AppraisalWithEmployee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.create({ data: { tenantId, employeeId, periodYear }, include: includeEmployee }),
    );
  }

  findAll(tenantId: string): Promise<AppraisalWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.findMany({ where: { tenantId }, include: includeEmployee, orderBy: { createdAt: "desc" } }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<AppraisalWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.findMany({
        where: { tenantId, employeeId },
        include: includeEmployee,
        orderBy: { periodYear: "desc" },
      }),
    );
  }

  findForEmployees(tenantId: string, employeeIds: string[]): Promise<AppraisalWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.findMany({
        where: { tenantId, employeeId: { in: employeeIds } },
        include: includeEmployee,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<AppraisalWithEmployee | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.findFirst({ where: { id, tenantId }, include: includeEmployee }),
    );
  }

  update(
    tenantId: string,
    id: string,
    data: Partial<
      Pick<
        Appraisal,
        | "status"
        | "selfRating"
        | "selfComments"
        | "selfSubmittedAt"
        | "managerRating"
        | "managerComments"
        | "managerSubmittedAt"
        | "finalizedAt"
      >
    >,
  ): Promise<Appraisal> {
    return this.prisma.withTenant(tenantId, (tx) => tx.appraisal.update({ where: { id }, data }));
  }

  /** Finalized appraisals not yet pulled into any calibration session — the pool CalibrationService.generateCases() draws from. */
  findEligibleForCalibration(
    tenantId: string,
    periodYear: number,
    departmentId?: string,
  ): Promise<AppraisalWithEmployee[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.appraisal.findMany({
        where: {
          tenantId,
          periodYear,
          status: "Finalized",
          calibrationSessionId: null,
          ...(departmentId ? { employee: { departmentId } } : {}),
        },
        include: includeEmployee,
      }),
    );
  }

  applyCalibration(
    tenantId: string,
    appraisalId: string,
    data: { calibratedRating: number; calibrationSessionId: string },
  ): Promise<Appraisal> {
    return this.prisma.withTenant(tenantId, (tx) => tx.appraisal.update({ where: { id: appraisalId }, data }));
  }
}
