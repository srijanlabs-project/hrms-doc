import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** code -> id for one entity kind, built once per step so row processing never re-queries per row. */
export type CodeIndex = Map<string, string>;

/**
 * Data access for the staged company-setup flow. Every method runs inside
 * PrismaService.withTenant for RLS scoping.
 *
 * Reads are code-indexed because the whole point of this flow is that the
 * uploaded payload refers to things by human-readable code while the database
 * keeps UUID foreign keys exactly as before — the resolution happens here,
 * server-side, instead of the person preparing the file doing it by hand.
 */
@Injectable()
export class CompanySetupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async indexDepartments(tenantId: string): Promise<CodeIndex> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.department.findMany({ where: { tenantId, deletedAt: null }, select: { id: true, code: true } }),
    );
    return new Map(rows.map((r) => [r.code, r.id]));
  }

  async indexDesignations(tenantId: string): Promise<CodeIndex> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.designation.findMany({ where: { tenantId, deletedAt: null }, select: { id: true, code: true } }),
    );
    return new Map(rows.map((r) => [r.code, r.id]));
  }

  async indexGrades(tenantId: string): Promise<CodeIndex> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.grade.findMany({ where: { tenantId, deletedAt: null }, select: { id: true, code: true } }),
    );
    return new Map(rows.map((r) => [r.code, r.id]));
  }

  async indexEmployees(tenantId: string): Promise<CodeIndex> {
    const rows = await this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.findMany({ where: { tenantId, deletedAt: null }, select: { id: true, employeeCode: true } }),
    );
    return new Map(rows.map((r) => [r.employeeCode, r.id]));
  }

  createDepartment(tenantId: string, data: { code: string; name: string; parentDepartmentId?: string }) {
    return this.prisma.withTenant(tenantId, (tx) => tx.department.create({ data: { tenantId, ...data } }));
  }

  createDesignation(tenantId: string, data: { code: string; title: string; careerTrack: string }) {
    return this.prisma.withTenant(tenantId, (tx) => tx.designation.create({ data: { tenantId, ...data } }));
  }

  createGrade(tenantId: string, data: { code: string; name: string; band?: string }) {
    return this.prisma.withTenant(tenantId, (tx) => tx.grade.create({ data: { tenantId, ...data } }));
  }

  createEmployee(
    tenantId: string,
    data: {
      employeeCode: string;
      legalName: string;
      personalEmail?: string;
      mobileNumber?: string;
      dateOfBirth?: Date;
      joiningDate?: Date;
      departmentId?: string;
      designationId?: string;
      gradeId?: string;
    },
  ) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.create({ data: { tenantId, status: "Active", ...data } }),
    );
  }

  /** Guarded by tenantId so a foreign employeeId updates nothing rather than silently succeeding. */
  async setManager(tenantId: string, employeeId: string, managerId: string): Promise<number> {
    const res = await this.prisma.withTenant(tenantId, (tx) =>
      tx.employee.updateMany({ where: { id: employeeId, tenantId, deletedAt: null }, data: { managerId } }),
    );
    return res.count;
  }

  upsertCompensation(tenantId: string, employeeId: string, monthlyBasic: number, effectiveFrom: Date) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeCompensation.upsert({
        where: { employeeId },
        create: { tenantId, employeeId, monthlyBasic, effectiveFrom },
        update: { monthlyBasic, effectiveFrom },
      }),
    );
  }

  /** Drives the wizard's per-step progress badges — counts only, no row detail. */
  async counts(tenantId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const [departments, designations, grades, employees, withManager, withSalary] = await Promise.all([
        tx.department.count({ where: { tenantId, deletedAt: null } }),
        tx.designation.count({ where: { tenantId, deletedAt: null } }),
        tx.grade.count({ where: { tenantId, deletedAt: null } }),
        tx.employee.count({ where: { tenantId, deletedAt: null } }),
        tx.employee.count({ where: { tenantId, deletedAt: null, managerId: { not: null } } }),
        tx.employeeCompensation.count({ where: { tenantId } }),
      ]);
      return { departments, designations, grades, employees, withManager, withSalary };
    });
  }
}
