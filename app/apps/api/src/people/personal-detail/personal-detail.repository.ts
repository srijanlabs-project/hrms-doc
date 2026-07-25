import { Injectable } from "@nestjs/common";
import type { EmergencyContact, PersonalDetail } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateEmergencyContactDto } from "./dto/create-emergency-contact.dto";
import type { UpsertPersonalDetailDto } from "./dto/upsert-personal-detail.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class PersonalDetailRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmployeeId(tenantId: string, employeeId: string): Promise<PersonalDetail | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.personalDetail.findFirst({ where: { tenantId, employeeId } }));
  }

  upsert(tenantId: string, employeeId: string, dto: UpsertPersonalDetailDto): Promise<PersonalDetail> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.personalDetail.upsert({
        where: { employeeId },
        create: { tenantId, employeeId, ...dto },
        update: dto,
      }),
    );
  }

  findEmergencyContacts(tenantId: string, employeeId: string): Promise<EmergencyContact[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyContact.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "asc" } }),
    );
  }

  createEmergencyContact(
    tenantId: string,
    employeeId: string,
    dto: CreateEmergencyContactDto,
  ): Promise<EmergencyContact> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyContact.create({ data: { tenantId, employeeId, ...dto } }),
    );
  }

  async deleteEmergencyContact(tenantId: string, employeeId: string, id: string): Promise<number> {
    const result = await this.prisma.withTenant(tenantId, (tx) =>
      tx.emergencyContact.deleteMany({ where: { id, tenantId, employeeId } }),
    );
    return result.count;
  }
}
