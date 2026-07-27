import { Injectable } from "@nestjs/common";
import type { CheckIn, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type CheckInWithRefs = CheckIn & {
  employee: { id: string; legalName: string; employeeCode: string };
  manager: { id: string; legalName: string; employeeCode: string };
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  manager: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.CheckInInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CheckInRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.CheckInUncheckedCreateInput, "tenantId">): Promise<CheckInWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.checkIn.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findById(tenantId: string, id: string): Promise<CheckInWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.checkIn.findFirst({ where: { id, tenantId }, include: includeRefs }));
  }

  /** Every check-in the caller is party to, either as the employee or the manager. */
  findForParticipant(tenantId: string, employeeId: string): Promise<CheckInWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.checkIn.findMany({
        where: { tenantId, OR: [{ employeeId }, { managerId: employeeId }] },
        include: includeRefs,
        orderBy: { scheduledDate: "desc" },
      }),
    );
  }

  update(tenantId: string, id: string, data: Partial<CheckIn>): Promise<CheckInWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) => tx.checkIn.update({ where: { id }, data, include: includeRefs }));
  }
}
