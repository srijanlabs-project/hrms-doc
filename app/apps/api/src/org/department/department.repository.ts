import { Injectable } from "@nestjs/common";
import type { Department } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateDepartmentDto } from "./dto/create-department.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class DepartmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<Department[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.department.findMany({
        where: { tenantId, deletedAt: null },
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<Department | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.department.findFirst({ where: { id, tenantId, deletedAt: null } }),
    );
  }

  create(tenantId: string, dto: CreateDepartmentDto): Promise<Department> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.department.create({
        data: {
          tenantId,
          code: dto.code,
          name: dto.name,
          parentDepartmentId: dto.parentDepartmentId,
        },
      }),
    );
  }
}
