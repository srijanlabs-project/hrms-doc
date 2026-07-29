import { Injectable } from "@nestjs/common";
import type { Prisma, SoftwareLicense, SoftwareLicenseAssignment } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type LicenseWithActiveAssignments = SoftwareLicense & { assignments: { id: string }[] };

export type LicenseAssignmentWithRefs = SoftwareLicenseAssignment & {
  employee: { id: string; legalName: string; employeeCode: string };
  license: { id: string; name: string; vendor: string | null };
};

const assignmentInclude = {
  employee: { select: { id: true, legalName: true, employeeCode: true } },
  license: { select: { id: true, name: true, vendor: true } },
} satisfies Prisma.SoftwareLicenseAssignmentInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LicenseRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.SoftwareLicenseUncheckedCreateInput, "tenantId">): Promise<SoftwareLicense> {
    return this.prisma.withTenant(tenantId, (tx) => tx.softwareLicense.create({ data: { ...data, tenantId } }));
  }

  /** Live-computed seat usage — assignments included, never a stored count. */
  findAll(tenantId: string): Promise<LicenseWithActiveAssignments[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicense.findMany({
        where: { tenantId, deletedAt: null },
        include: { assignments: { where: { status: "Active" }, select: { id: true } } },
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findActive(tenantId: string): Promise<LicenseWithActiveAssignments[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicense.findMany({
        where: { tenantId, deletedAt: null, status: "Active" },
        include: { assignments: { where: { status: "Active" }, select: { id: true } } },
        orderBy: { name: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<LicenseWithActiveAssignments | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicense.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: { assignments: { where: { status: "Active" }, select: { id: true } } },
      }),
    );
  }

  findExpiryCandidates(tenantId: string): Promise<SoftwareLicense[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicense.findMany({ where: { tenantId, deletedAt: null, status: "Active", expiryDate: { not: null } } }),
    );
  }

  async markExpired(tenantId: string, ids: string[]): Promise<void> {
    await this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicense.updateMany({ where: { id: { in: ids }, tenantId }, data: { status: "Expired" } }),
    );
  }

  createAssignment(
    tenantId: string,
    data: Omit<Prisma.SoftwareLicenseAssignmentUncheckedCreateInput, "tenantId">,
  ): Promise<LicenseAssignmentWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicenseAssignment.create({ data: { ...data, tenantId }, include: assignmentInclude }),
    );
  }

  findAssignmentById(tenantId: string, id: string): Promise<LicenseAssignmentWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicenseAssignment.findFirst({ where: { id, tenantId }, include: assignmentInclude }),
    );
  }

  findAssignmentsForEmployee(tenantId: string, employeeId: string): Promise<LicenseAssignmentWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicenseAssignment.findMany({
        where: { tenantId, employeeId },
        include: assignmentInclude,
        orderBy: { assignedAt: "desc" },
      }),
    );
  }

  findAllAssignments(tenantId: string): Promise<LicenseAssignmentWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicenseAssignment.findMany({
        where: { tenantId },
        include: assignmentInclude,
        orderBy: { assignedAt: "desc" },
      }),
    );
  }

  /** Only succeeds if the assignment is currently Active — guards against double-revoke races. */
  async revoke(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.softwareLicenseAssignment.updateMany({
        where: { id, tenantId, status: "Active" },
        data: { status: "Revoked", revokedAt: new Date() },
      }),
    );
    return result.count;
  }
}
