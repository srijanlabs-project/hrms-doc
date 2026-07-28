import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

@Injectable()
export class ConsentRepository {
  constructor(private readonly prisma: PrismaService) {}

  findForEmployee(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.consentRecord.findMany({ where: { tenantId, employeeId }, orderBy: { purpose: "asc" } }),
    );
  }

  findAll(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.consentRecord.findMany({
        where: { tenantId },
        orderBy: [{ status: "asc" }, { purpose: "asc" }],
        include: { employee: { select: { legalName: true } } },
      }),
    );
  }

  upsert(tenantId: string, employeeId: string, purpose: string, status: "Granted" | "Revoked", notes?: string) {
    const now = new Date();
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.consentRecord.upsert({
        where: { tenantId_employeeId_purpose: { tenantId, employeeId, purpose } },
        create: {
          tenantId,
          employeeId,
          purpose,
          status,
          notes,
          grantedAt: status === "Granted" ? now : undefined,
          revokedAt: status === "Revoked" ? now : undefined,
        },
        update: {
          status,
          notes,
          grantedAt: status === "Granted" ? now : undefined,
          revokedAt: status === "Revoked" ? now : null,
        },
      }),
    );
  }
}
