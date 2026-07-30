import { Injectable } from "@nestjs/common";
import type { Prisma, User } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type EmployeeAccessRow = {
  employeeId: string;
  employeeCode: string;
  legalName: string;
  personalEmail: string | null;
  status: string;
  departmentName: string | null;
  user: { id: string; email: string; roles: string[]; status: string } | null;
};

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class UserAccessRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Every non-deleted employee joined to its login (if any) — the source for both the access list and the "who's missing a login" bulk selection. */
  async findEmployeeAccess(tenantId: string): Promise<EmployeeAccessRow[]> {
    const [employees, users] = await this.prisma.withTenant(tenantId, async (tx) => {
      const employeeRows = await tx.employee.findMany({
        where: { tenantId, deletedAt: null },
        select: {
          id: true,
          employeeCode: true,
          legalName: true,
          personalEmail: true,
          status: true,
          department: { select: { name: true } },
        },
        orderBy: { employeeCode: "asc" },
      });
      const userRows = await tx.user.findMany({
        where: { tenantId, deletedAt: null, employeeId: { not: null } },
        select: { id: true, email: true, roles: true, status: true, employeeId: true },
      });
      return [employeeRows, userRows] as const;
    });

    const byEmployeeId = new Map(users.map((u) => [u.employeeId!, u]));
    return employees.map((e) => {
      const user = byEmployeeId.get(e.id);
      return {
        employeeId: e.id,
        employeeCode: e.employeeCode,
        legalName: e.legalName,
        personalEmail: e.personalEmail,
        status: e.status,
        departmentName: e.department?.name ?? null,
        user: user ? { id: user.id, email: user.email, roles: user.roles, status: user.status } : null,
      };
    });
  }

  createUser(tenantId: string, data: { email: string; roles: string[]; employeeId: string }): Promise<User> {
    return this.prisma.withTenant(tenantId, (tx) => tx.user.create({ data: { ...data, tenantId } }));
  }

  /** Guarded by tenantId in the where clause so a foreign userId updates nothing rather than silently succeeding — caller checks the returned count. */
  async updateRoles(tenantId: string, userId: string, roles: string[]): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.user.updateMany({ where: { id: userId, tenantId, deletedAt: null }, data: { roles } }),
    );
    return result.count;
  }

  findUserByEmail(tenantId: string, email: string): Promise<User | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.user.findFirst({ where: { tenantId, email, deletedAt: null } }),
    );
  }

  findEmployeeById(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findFirst({
        where: { id: employeeId, tenantId, deletedAt: null },
        select: { id: true, legalName: true, personalEmail: true, status: true },
      }),
    );
  }

  isUniqueViolation(err: unknown): err is Prisma.PrismaClientKnownRequestError {
    return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
  }
}
