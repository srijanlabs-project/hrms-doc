import { Injectable } from "@nestjs/common";
import type { Candidate, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CandidateRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.CandidateUncheckedCreateInput, "tenantId">): Promise<Candidate> {
    return this.prisma.withTenant(tenantId, (tx) => tx.candidate.create({ data: { ...data, tenantId } }));
  }

  findAll(tenantId: string): Promise<Candidate[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.candidate.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<Candidate | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.candidate.findFirst({ where: { id, tenantId } }));
  }

  /** Employee Referrals "my referrals" list, with each candidate's applications rolled up. */
  findReferredByEmployee(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.candidate.findMany({
        where: { tenantId, referredByEmployeeId: employeeId },
        include: {
          applications: {
            select: { id: true, stage: true, requisition: { select: { id: true, title: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Internal Mobility: an employee's own candidate record, reused across every internal application they submit. */
  findByEmployeeId(tenantId: string, employeeId: string): Promise<Candidate | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.candidate.findFirst({ where: { tenantId, employeeId } }));
  }

  /** Internal Mobility "my applications" list, with each candidate's applications rolled up. */
  findInternalMobilityByEmployee(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.candidate.findMany({
        where: { tenantId, employeeId },
        include: {
          applications: {
            select: { id: true, stage: true, requisition: { select: { id: true, title: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  /** Talent Pool (W3·E06 gap closure): candidates with zero applications — sourced, not yet applied to anything. */
  findPool(tenantId: string): Promise<Candidate[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.candidate.findMany({
        where: { tenantId, applications: { none: {} } },
        orderBy: { createdAt: "desc" },
      }),
    );
  }
}
