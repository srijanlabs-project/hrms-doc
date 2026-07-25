import { Injectable } from "@nestjs/common";
import type { WorkCalendar, WorkCalendarAssignment, WorkCalendarDay } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { AddCalendarDayDto } from "./dto/add-calendar-day.dto";
import type { AssignCalendarDto } from "./dto/assign-calendar.dto";
import type { CreateWorkCalendarDto } from "./dto/create-work-calendar.dto";

export type WorkCalendarWithDays = WorkCalendar & { days: WorkCalendarDay[] };

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class WorkCalendarRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string): Promise<WorkCalendarWithDays[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendar.findMany({
        where: { tenantId, deletedAt: null },
        include: { days: { orderBy: { date: "asc" } } },
        orderBy: { createdAt: "asc" },
      }),
    );
  }

  findById(tenantId: string, id: string): Promise<WorkCalendar | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendar.findFirst({ where: { id, tenantId, deletedAt: null } }),
    );
  }

  create(tenantId: string, dto: CreateWorkCalendarDto): Promise<WorkCalendar> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendar.create({ data: { tenantId, code: dto.code, name: dto.name } }),
    );
  }

  publish(tenantId: string, id: string): Promise<WorkCalendar> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendar.update({ where: { id }, data: { status: "Published" } }),
    );
  }

  addDay(tenantId: string, calendarId: string, dto: AddCalendarDayDto): Promise<WorkCalendarDay> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendarDay.create({
        data: {
          tenantId,
          calendarId,
          date: new Date(dto.date),
          dayType: dto.dayType,
          label: dto.label,
        },
      }),
    );
  }

  assign(tenantId: string, calendarId: string, dto: AssignCalendarDto): Promise<WorkCalendarAssignment> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendarAssignment.create({
        data: { tenantId, calendarId, scope: dto.scope, scopeId: dto.scopeId },
      }),
    );
  }

  findAssignments(tenantId: string): Promise<WorkCalendarAssignment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendarAssignment.findMany({ where: { tenantId }, orderBy: { createdAt: "asc" } }),
    );
  }

  /**
   * Department-scoped assignment wins over the tenant-wide default; only a
   * Published calendar counts as effective. No uniqueness constraint stops
   * more than one assignment existing for the same scope, so the most
   * recently created one wins ("last assignment wins", same intent as
   * ShiftAssignment/EmployeeFlexAssignment's close-prior-then-create pattern,
   * without a schema change to actually retire the older assignment). Used
   * by LeaveRequestService to resolve which calendar's holidays/weekends
   * apply to an employee.
   */
  async findEffectiveCalendarId(tenantId: string, departmentId: string | null): Promise<string | null> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      if (departmentId) {
        const deptAssignment = await tx.workCalendarAssignment.findFirst({
          where: { tenantId, scope: "Department", scopeId: departmentId },
          include: { calendar: true },
          orderBy: { createdAt: "desc" },
        });
        if (deptAssignment && deptAssignment.calendar.status === "Published") return deptAssignment.calendarId;
      }
      const tenantAssignment = await tx.workCalendarAssignment.findFirst({
        where: { tenantId, scope: "Tenant" },
        include: { calendar: true },
        orderBy: { createdAt: "desc" },
      });
      if (tenantAssignment && tenantAssignment.calendar.status === "Published") return tenantAssignment.calendarId;
      return null;
    });
  }

  /** Dates (as "YYYY-MM-DD") within range that are Holiday/Weekend/Shutdown on the given calendar. */
  async findNonWorkingDatesInRange(tenantId: string, calendarId: string, from: Date, to: Date): Promise<Set<string>> {
    const days = await this.prisma.withTenant(tenantId, (tx) =>
      tx.workCalendarDay.findMany({
        where: { tenantId, calendarId, date: { gte: from, lte: to }, dayType: { in: ["Holiday", "Weekend", "Shutdown"] } },
        select: { date: true },
      }),
    );
    return new Set(days.map((d) => d.date.toISOString().slice(0, 10)));
  }
}
