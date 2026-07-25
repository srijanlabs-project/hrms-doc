import { Injectable } from "@nestjs/common";
import type { Designation } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateDesignationDto } from "./dto/create-designation.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class DesignationRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<Designation[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.designation.findMany({ where: { tenantId, deletedAt: null }, orderBy: { createdAt: "asc" } }),
    );
  }

  create(tenantId: string, dto: CreateDesignationDto): Promise<Designation> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.designation.create({
        data: {
          tenantId,
          code: dto.code,
          title: dto.title,
          jobFunctionId: dto.jobFunctionId,
          careerTrack: dto.careerTrack,
        },
      }),
    );
  }
}
