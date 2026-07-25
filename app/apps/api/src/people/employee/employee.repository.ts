import { Injectable } from "@nestjs/common";
import type { Employee, Prisma } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Shape returned by list/get — includes the department name for display, not just its id. */
export type EmployeeWithDepartment = Employee & {
  department: { id: string; name: string } | null;
};

const includeDepartment = {
  department: { select: { id: true, name: true } },
} satisfies Prisma.EmployeeInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class EmployeeRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<EmployeeWithDepartment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findMany({
        where: { tenantId, deletedAt: null },
        include: includeDepartment,
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  /** Active employees only — the mandatory-training assignment sweep's target population. */
  findActive(tenantId: string): Promise<EmployeeWithDepartment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findMany({
        where: { tenantId, deletedAt: null, status: "Active" },
        include: includeDepartment,
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<EmployeeWithDepartment | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findFirst({
        where: { id, tenantId, deletedAt: null },
        include: includeDepartment,
      }),
    );
  }

  findByManagerId(tenantId: string, managerId: string): Promise<EmployeeWithDepartment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findMany({
        where: { tenantId, managerId, deletedAt: null },
        include: includeDepartment,
        orderBy: { legalName: "asc" },
      }),
    );
  }

  create(
    tenantId: string,
    data: Omit<Prisma.EmployeeUncheckedCreateInput, "tenantId">,
  ): Promise<EmployeeWithDepartment> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.create({
        data: { ...data, tenantId },
        include: includeDepartment,
      }),
    );
  }

  updateStatus(tenantId: string, id: string, status: string): Promise<Employee> {
    return this.prisma.withTenant(tenantId, (tx) => tx.employee.update({ where: { id }, data: { status } }));
  }

  applyAssignmentChange(
    tenantId: string,
    id: string,
    data: { departmentId?: string; managerId?: string; designationId?: string; gradeId?: string },
  ): Promise<EmployeeWithDepartment> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.update({ where: { id }, data, include: includeDepartment }),
    );
  }

  updateContractEndDate(tenantId: string, id: string, contractEndDate: Date): Promise<Employee> {
    return this.prisma.withTenant(tenantId, (tx) => tx.employee.update({ where: { id }, data: { contractEndDate } }));
  }

  updateOrgAssignment(
    tenantId: string,
    id: string,
    data: { positionId?: string; gradeId?: string; financialCenterId?: string; workerType?: string },
  ): Promise<EmployeeWithDepartment> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.update({ where: { id }, data, include: includeDepartment }),
    );
  }

  markSeparated(tenantId: string, id: string, lastWorkingDay: Date, exitReason?: string): Promise<Employee> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.update({
        where: { id },
        data: { status: "Separated", lastWorkingDay, exitReason },
      }),
    );
  }
}
