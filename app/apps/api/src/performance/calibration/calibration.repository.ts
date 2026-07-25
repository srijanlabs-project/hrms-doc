import { Injectable } from "@nestjs/common";
import type { CalibrationCase, CalibrationSession, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CalibrationCaseWithRefs = CalibrationCase & {
  employee: { id: string; legalName: string; employeeCode: string };
};

export type CalibrationSessionWithCases = CalibrationSession & { cases: CalibrationCaseWithRefs[] };

const includeCases = {
  cases: { include: { employee: { select: { id: true, legalName: true, employeeCode: true } } } },
} satisfies Prisma.CalibrationSessionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CalibrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: { periodYear: number; cohortLabel: string; createdByUserId: string },
  ): Promise<CalibrationSession> {
    return this.prisma.withTenant(tenantId, (tx) => tx.calibrationSession.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<CalibrationSessionWithCases[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.calibrationSession.findMany({ where: { tenantId }, include: includeCases, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<CalibrationSessionWithCases | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.calibrationSession.findFirst({ where: { id, tenantId }, include: includeCases }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<Pick<CalibrationSession, "status" | "closedByUserId" | "closedAt">>,
  ): Promise<CalibrationSession> {
    return this.prisma.withTenant(tenantId, (tx) => tx.calibrationSession.update({ where: { id }, data }));
  }

  createCases(
    tenantId: string,
    rows: Array<{ sessionId: string; appraisalId: string; employeeId: string; originalRating: number }>,
  ) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.calibrationCase.createMany({ data: rows.map((r) => ({ ...r, tenantId })) }),
    );
  }

  findCaseById(tenantId: string, id: string): Promise<CalibrationCase | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.calibrationCase.findFirst({ where: { id, tenantId } }));
  }

  updateCase(
    tenantId: string,
    id: string,
    data: Partial<Pick<CalibrationCase, "calibratedRating" | "rationale" | "decidedByUserId" | "decidedAt">>,
  ): Promise<CalibrationCase> {
    return this.prisma.withTenant(tenantId, (tx) => tx.calibrationCase.update({ where: { id }, data }));
  }

  findCasesForSession(tenantId: string, sessionId: string): Promise<CalibrationCase[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.calibrationCase.findMany({ where: { tenantId, sessionId } }));
  }
}
