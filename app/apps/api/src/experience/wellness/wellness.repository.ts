import { Injectable } from "@nestjs/common";
import type { Prisma, WellnessEnrollment, WellnessProgram } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type WellnessProgramWithEnrollmentCount = WellnessProgram & { _count: { enrollments: number } };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class WellnessRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.WellnessProgramUncheckedCreateInput, "tenantId">): Promise<WellnessProgram> {
    return this.prisma.withTenant(tenantId, (tx) => tx.wellnessProgram.create({ data: { ...data, tenantId } }));
  }

  findAllActive(tenantId: string): Promise<WellnessProgramWithEnrollmentCount[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.wellnessProgram.findMany({
        where: { tenantId, status: "Active" },
        include: { _count: { select: { enrollments: true } } },
        orderBy: { startDate: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<WellnessProgram | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.wellnessProgram.findFirst({ where: { id, tenantId } }));
  }

  findMyEnrollment(tenantId: string, programId: string, employeeId: string): Promise<WellnessEnrollment | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.wellnessEnrollment.findFirst({ where: { tenantId, programId, employeeId } }),
    );
  }

  enroll(tenantId: string, programId: string, employeeId: string): Promise<WellnessEnrollment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.wellnessEnrollment.create({ data: { tenantId, programId, employeeId } }));
  }

  findMyEnrollments(tenantId: string, employeeId: string): Promise<WellnessEnrollment[]> {
    return this.prisma.withTenant(tenantId, (tx) => tx.wellnessEnrollment.findMany({ where: { tenantId, employeeId } }));
  }
}
