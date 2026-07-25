import { Injectable } from "@nestjs/common";
import type { CertificationCatalog, CertificationRecord, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type RecordWithRefs = CertificationRecord & {
  employee: { id: string; legalName: string; employeeCode: string; managerId: string | null };
  certification: { id: string; code: string; name: string; issuer: string | null; isMandatory: boolean };
};

const includeRefs = {
  employee: { select: { id: true, legalName: true, employeeCode: true, managerId: true } },
  certification: { select: { id: true, code: true, name: true, issuer: true, isMandatory: true } },
} satisfies Prisma.CertificationRecordInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CertificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCatalogEntry(
    tenantId: string,
    data: Omit<Prisma.CertificationCatalogUncheckedCreateInput, "tenantId">,
  ): Promise<CertificationCatalog> {
    return this.prisma.withTenant(tenantId, (tx) => tx.certificationCatalog.create({ data: { ...data, tenantId } }));
  }

  findCatalog(tenantId: string): Promise<CertificationCatalog[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationCatalog.findMany({ where: { tenantId, isActive: true }, orderBy: { name: "asc" } }),
    );
  }

  findCatalogById(tenantId: string, id: string): Promise<CertificationCatalog | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.certificationCatalog.findFirst({ where: { id, tenantId } }));
  }

  createRecord(
    tenantId: string,
    data: {
      employeeId: string;
      certificationCatalogId: string;
      certificateNumber?: string;
      issueDate: Date;
      expiryDate: Date | null;
      evidenceFileId?: string;
    },
  ): Promise<RecordWithRefs> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationRecord.create({ data: { ...data, tenantId }, include: includeRefs }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<RecordWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationRecord.findMany({
        where: { tenantId, employeeId },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findAll(tenantId: string, status?: string): Promise<RecordWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationRecord.findMany({
        where: { tenantId, ...(status ? { status } : {}) },
        include: includeRefs,
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<RecordWithRefs | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationRecord.findFirst({ where: { id, tenantId }, include: includeRefs }),
    );
  }

  /** Active/Expiring records — the expiry sweep's candidate pool. */
  findActiveOrExpiring(tenantId: string): Promise<RecordWithRefs[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.certificationRecord.findMany({
        where: { tenantId, status: { in: ["Active", "Expiring"] }, expiryDate: { not: null } },
        include: includeRefs,
      }),
    );
  }

  updateStatus(
    tenantId: string,
    id: string,
    data: Partial<
      Pick<CertificationRecord, "status" | "verifiedByUserId" | "verifiedAt" | "revokedReason">
    >,
  ): Promise<CertificationRecord> {
    return this.prisma.withTenant(tenantId, (tx) => tx.certificationRecord.update({ where: { id }, data }));
  }
}
