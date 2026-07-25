import { Injectable } from "@nestjs/common";
import type { BackgroundCheck } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class BackgroundCheckRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    offerId: string,
    data: { checkType: string; initiatedByUserId: string },
  ): Promise<BackgroundCheck> {
    return this.prisma.withTenant(tenantId, (tx) => tx.backgroundCheck.create({ data: { tenantId, offerId, ...data } }));
  }

  findByOfferId(tenantId: string, offerId: string): Promise<BackgroundCheck | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.backgroundCheck.findFirst({ where: { tenantId, offerId } }));
  }

  updateResult(
    tenantId: string,
    id: string,
    data: { status: string; remarks?: string; completedAt: Date },
  ): Promise<BackgroundCheck> {
    return this.prisma.withTenant(tenantId, (tx) => tx.backgroundCheck.update({ where: { id }, data }));
  }
}
