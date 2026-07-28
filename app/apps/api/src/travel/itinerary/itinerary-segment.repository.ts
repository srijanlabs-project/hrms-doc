import { Injectable } from "@nestjs/common";
import type { Prisma, TravelItinerarySegment } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class ItinerarySegmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    tenantId: string,
    data: Omit<Prisma.TravelItinerarySegmentUncheckedCreateInput, "tenantId">,
  ): Promise<TravelItinerarySegment> {
    return this.prisma.withTenant(tenantId, (tx) => tx.travelItinerarySegment.create({ data: { ...data, tenantId } }));
  }

  findForTravelRequest(tenantId: string, travelRequestId: string): Promise<TravelItinerarySegment[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.travelItinerarySegment.findMany({ where: { tenantId, travelRequestId }, orderBy: { sequence: "asc" } }),
    );
  }

  async delete(tenantId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.travelItinerarySegment.deleteMany({ where: { id, tenantId } }),
    );
    return result.count;
  }
}
