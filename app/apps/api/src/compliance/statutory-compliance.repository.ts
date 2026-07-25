import { Injectable } from "@nestjs/common";
import type { Prisma, StatutoryComplianceSetting } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class StatutoryComplianceRepository {
  constructor(private readonly prisma: PrismaService) {}

  find(tenantId: string): Promise<StatutoryComplianceSetting | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.statutoryComplianceSetting.findUnique({ where: { tenantId } }));
  }

  upsert(
    tenantId: string,
    data: Omit<Prisma.StatutoryComplianceSettingUncheckedCreateInput, "tenantId">,
  ): Promise<StatutoryComplianceSetting> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.statutoryComplianceSetting.upsert({
        where: { tenantId },
        create: { ...data, tenantId },
        update: data,
      }),
    );
  }
}
