import { Injectable } from "@nestjs/common";
import type { JobFunction } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateJobFunctionDto } from "./dto/create-job-function.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class JobFunctionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<JobFunction[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.jobFunction.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  create(tenantId: string, dto: CreateJobFunctionDto): Promise<JobFunction> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.jobFunction.create({
        data: { tenantId, code: dto.code, name: dto.name, jobFamilyId: dto.jobFamilyId },
      }),
    );
  }
}
