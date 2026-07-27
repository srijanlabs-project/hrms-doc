import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../platform/prisma/prisma.service";

/**
 * The curated "core system-of-record" snapshot: org structure, people, leave,
 * and payroll — not every table in the schema. A full pg_dump-parity backup
 * has no consumer here (no replica/PITR infra to restore into), so this
 * stays a bounded, meaningful cross-section rather than an exhaustive dump.
 */
export interface BackupSnapshot {
  legalEntities: unknown[];
  departments: unknown[];
  employees: unknown[];
  users: unknown[];
  leavePolicies: unknown[];
  leaveRequests: unknown[];
  employeeCompensations: unknown[];
  payrollRuns: unknown[];
}

export interface CreateBackupRecordInput {
  status: "Succeeded" | "Failed";
  triggeredBy: "Manual" | "Scheduled";
  tableCounts: Record<string, number>;
  fileId?: string;
  errorMessage?: string;
}

@Injectable()
export class BackupRepository {
  constructor(private readonly prisma: PrismaService) {}

  snapshotTenant(tenantId: string): Promise<BackupSnapshot> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const [
        legalEntities,
        departments,
        employees,
        users,
        leavePolicies,
        leaveRequests,
        employeeCompensations,
        payrollRuns,
      ] = await Promise.all([
        tx.legalEntity.findMany({ where: { tenantId } }),
        tx.department.findMany({ where: { tenantId } }),
        tx.employee.findMany({ where: { tenantId } }),
        tx.user.findMany({ where: { tenantId }, select: { id: true, email: true, roles: true, status: true, employeeId: true, createdAt: true } }),
        tx.leavePolicy.findMany({ where: { tenantId } }),
        tx.leaveRequest.findMany({ where: { tenantId } }),
        tx.employeeCompensation.findMany({ where: { tenantId } }),
        tx.payrollRun.findMany({ where: { tenantId } }),
      ]);
      return { legalEntities, departments, employees, users, leavePolicies, leaveRequests, employeeCompensations, payrollRuns };
    });
  }

  create(tenantId: string, input: CreateBackupRecordInput) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.backupRecord.create({
        data: { tenantId, ...input },
      }),
    );
  }

  findAll(tenantId: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.backupRecord.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, include: { file: { select: { id: true, originalName: true, sizeBytes: true } } } }),
    );
  }

  findById(tenantId: string, id: string) {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.backupRecord.findFirst({ where: { id, tenantId }, include: { file: true } }),
    );
  }
}
