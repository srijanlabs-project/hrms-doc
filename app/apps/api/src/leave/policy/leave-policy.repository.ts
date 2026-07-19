import { Injectable } from "@nestjs/common";
import type { LeavePolicy } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateLeavePolicyDto } from "./dto/create-leave-policy.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class LeavePolicyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<LeavePolicy[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leavePolicy.findMany({ where: { tenantId, deletedAt: null }, orderBy: { leaveType: "asc" } }),
    );
  }

  findByType(tenantId: string, leaveType: string): Promise<LeavePolicy | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.leavePolicy.findFirst({ where: { tenantId, leaveType, deletedAt: null } }),
    );
  }

  create(tenantId: string, dto: CreateLeavePolicyDto): Promise<LeavePolicy> {
    return this.prisma.withTenant(tenantId, (tx) => tx.leavePolicy.create({ data: { tenantId, ...dto } }));
  }
}
