import { Injectable } from "@nestjs/common";
import type { Position, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreatePositionDto } from "./dto/create-position.dto";

export type PositionWithRefs = Position & {
  department: { id: string; name: string };
  designation: { id: string; title: string } | null;
  employees: { id: string; legalName: string; employeeCode: string }[];
};

const includeRefs = {
  department: { select: { id: true, name: true } },
  designation: { select: { id: true, title: true } },
  employees: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.PositionInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PositionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<PositionWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.position.findMany({
        where: { tenantId, deletedAt: null },
        include: includeRefs,
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<PositionWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.position.findFirst({ where: { id, tenantId, deletedAt: null }, include: includeRefs }),
    );
  }

  create(tenantId: string, dto: CreatePositionDto): Promise<PositionWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.position.create({
        data: {
          tenantId,
          code: dto.code,
          title: dto.title,
          departmentId: dto.departmentId,
          designationId: dto.designationId,
        },
        include: includeRefs,
      }),
    );
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<PositionWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.position.update({ where: { id }, data: { status }, include: includeRefs }),
    );
  }
}
