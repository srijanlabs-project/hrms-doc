import { Injectable } from "@nestjs/common";
import type { AttendanceDay } from "@prisma/client";
import { PrismaService } from "../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class AttendanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  mark(
    tenantId: string,
    employeeId: string,
    date: Date,
    status: string,
    flex?: { checkInTime?: string; checkOutTime?: string; flexCompliant?: boolean },
  ): Promise<AttendanceDay> {
    const flexFields = {
      checkInTime: flex?.checkInTime,
      checkOutTime: flex?.checkOutTime,
      flexCompliant: flex?.flexCompliant,
    };
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.attendanceDay.upsert({
        where: { tenantId_employeeId_date: { tenantId, employeeId, date } },
        create: { tenantId, employeeId, date, status, source: "Manual", ...flexFields },
        update: { status, source: "Manual", ...flexFields },
      }),
    );
  }

  findForEmployeeRange(tenantId: string, employeeId: string, from: Date, to: Date): Promise<AttendanceDay[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.attendanceDay.findMany({
        where: { tenantId, employeeId, date: { gte: from, lte: to } },
        orderBy: { date: "asc" },
      }),
    );
  }

  findForEmployeesOnDate(tenantId: string, employeeIds: string[], date: Date): Promise<AttendanceDay[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.attendanceDay.findMany({
        where: { tenantId, employeeId: { in: employeeIds }, date },
      }),
    );
  }

  /** Used by payroll processing to derive payable days for every employee in a run, in one query rather than one-per-employee. */
  findForEmployeesRange(tenantId: string, employeeIds: string[], from: Date, to: Date): Promise<AttendanceDay[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.attendanceDay.findMany({
        where: { tenantId, employeeId: { in: employeeIds }, date: { gte: from, lte: to } },
      }),
    );
  }
}
