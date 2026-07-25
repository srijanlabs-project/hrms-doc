import { Injectable } from "@nestjs/common";
import type { Prisma, Recognition } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RecognitionWithEmployees = Recognition & {
  fromEmployee: { id: string; legalName: string };
  toEmployee: { id: string; legalName: string };
};

const includeEmployees = {
  fromEmployee: { select: { id: true, legalName: true } },
  toEmployee: { select: { id: true, legalName: true } },
} satisfies Prisma.RecognitionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class RecognitionRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.RecognitionUncheckedCreateInput, "tenantId">,
  ): Promise<RecognitionWithEmployees> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.recognition.create({ data: { ...data, tenantId }, include: includeEmployees }),
    );
  }

  findFeed(tenantId: string, limit = 50): Promise<RecognitionWithEmployees[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.recognition.findMany({ where: { tenantId }, include: includeEmployees, orderBy: { createdAt: "desc" }, take: limit }),
    );
  }

  findReceivedByEmployee(tenantId: string, employeeId: string): Promise<RecognitionWithEmployees[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.recognition.findMany({
        where: { tenantId, toEmployeeId: employeeId },
        include: includeEmployees,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findGivenByEmployee(tenantId: string, employeeId: string): Promise<RecognitionWithEmployees[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.recognition.findMany({
        where: { tenantId, fromEmployeeId: employeeId },
        include: includeEmployees,
        orderBy: { createdAt: "desc" },
      }),
    );
  }
}
