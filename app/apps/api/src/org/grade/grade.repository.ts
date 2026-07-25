import { Injectable } from "@nestjs/common";
import type { Grade } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateGradeDto } from "./dto/create-grade.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class GradeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<Grade[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grade.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  create(tenantId: string, dto: CreateGradeDto): Promise<Grade> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.grade.create({
        data: {
          tenantId,
          code: dto.code,
          name: dto.name,
          band: dto.band,
          minCompensation: dto.minCompensation,
          maxCompensation: dto.maxCompensation,
        },
      }),
    );
  }
}
