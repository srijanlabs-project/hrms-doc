import { Injectable } from "@nestjs/common";
import type { Delegation } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateDelegationDto } from "./dto/create-delegation.dto";

const userSummary = { select: { id: true, email: true } } as const;

@Injectable()
export class DelegationRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, delegatorUserId: string, createdByUserId: string, dto: CreateDelegationDto): Promise<Delegation> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.delegation.create({
        data: {
          tenantId,
          delegatorUserId,
          delegateUserId: dto.delegateUserId,
          scope: dto.scope,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          createdByUserId,
        },
      }),
    );
  }

  findMineGiven(tenantId: string, delegatorUserId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.delegation.findMany({
        where: { tenantId, delegatorUserId },
        orderBy: { createdAt: "desc" },
        include: { delegate: userSummary },
      }),
    );
  }

  findMineReceived(tenantId: string, delegateUserId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.delegation.findMany({
        where: { tenantId, delegateUserId },
        orderBy: { createdAt: "desc" },
        include: { delegator: userSummary },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<Delegation | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.delegation.findFirst({ where: { id, tenantId } }));
  }

  revoke(tenantId: string, id: string): Promise<Delegation> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.delegation.update({ where: { id }, data: { status: "Revoked", revokedAt: new Date() } }),
    );
  }

  async hasActiveMatch(tenantId: string, delegateUserId: string, delegatorUserId: string, scope: string, onDate: Date): Promise<boolean> {
    const match = await this.prisma.withTenant(tenantId, (tx) =>
      tx.delegation.findFirst({
        where: {
          tenantId,
          delegateUserId,
          delegatorUserId,
          scope: { in: [scope, "All"] },
          status: "Active",
          startDate: { lte: onDate },
          endDate: { gte: onDate },
        },
      }),
    );
    return !!match;
  }
}
