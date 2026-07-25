import { Injectable } from "@nestjs/common";
import type { JobFamily } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateJobFamilyDto } from "./dto/create-job-family.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class JobFamilyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<JobFamily[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.jobFamily.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  findById(tenantId: string, id: string): Promise<JobFamily | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.jobFamily.findFirst({ where: { id, tenantId, deletedAt: null } }));
  }

  create(tenantId: string, dto: CreateJobFamilyDto): Promise<JobFamily> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.jobFamily.create({ data: { tenantId, code: dto.code, name: dto.name } }),
    );
  }
}
