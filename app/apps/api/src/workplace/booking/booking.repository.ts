import { Injectable } from "@nestjs/common";
import type { Prisma, WorkplaceBooking } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

export type BookingWithDetail = WorkplaceBooking & {
  resource: { id: string; type: string; name: string; capacity: number };
  employee: { id: string; legalName: string; employeeCode: string };
};

const includeDetail = {
  resource: { select: { id: true, type: true, name: true, capacity: true } },
  employee: { select: { id: true, legalName: true, employeeCode: true } },
} satisfies Prisma.WorkplaceBookingInclude;

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: Omit<Prisma.WorkplaceBookingUncheckedCreateInput, "tenantId">): Promise<BookingWithDetail> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.create({ data: { ...data, tenantId }, include: includeDetail }),
    );
  }

  findById(tenantId: string, id: string): Promise<BookingWithDetail | null> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.findFirst({ where: { id, tenantId }, include: includeDetail }),
    );
  }

  countConfirmedForResourceOnDate(tenantId: string, resourceId: string, bookingDate: Date): Promise<number> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.count({ where: { tenantId, resourceId, bookingDate, status: "Confirmed" } }),
    );
  }

  findForEmployee(tenantId: string, employeeId: string): Promise<BookingWithDetail[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.findMany({ where: { tenantId, employeeId }, include: includeDetail, orderBy: { bookingDate: "desc" } }),
    );
  }

  findAll(tenantId: string): Promise<BookingWithDetail[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.findMany({ where: { tenantId }, include: includeDetail, orderBy: { bookingDate: "desc" } }),
    );
  }

  async cancel(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.workplaceBooking.updateMany({ where: { id, tenantId, status: "Confirmed" }, data: { status: "Cancelled" } }),
    );
    return result.count;
  }
}
