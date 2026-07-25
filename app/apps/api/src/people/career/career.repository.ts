import { Injectable } from "@nestjs/common";
import type {
  ContractRenewal,
  EmployeeAssignmentHistory,
  EmployeeDocument,
  Prisma,
  ProbationRecord,
} from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateContractRenewalDto } from "./dto/create-contract-renewal.dto";
import type { CreateEmployeeDocumentDto } from "./dto/create-employee-document.dto";
import type { CreateProbationDto } from "./dto/create-probation.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class CareerRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: string, employeeId: string) {
    return this.prisma.withTenant(tenantId, async (tx) => {
      const [assignmentHistory, probationRecords, contractRenewals, documents] = await Promise.all([
        tx.employeeAssignmentHistory.findMany({ where: { tenantId, employeeId }, orderBy: { effectiveDate: "desc" } }),
        tx.probationRecord.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
        tx.contractRenewal.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
        tx.employeeDocument.findMany({
          where: { tenantId, employeeId },
          orderBy: { createdAt: "desc" },
          include: { file: { select: { id: true, originalName: true, mimeType: true } } },
        }),
      ]);
      return { assignmentHistory, probationRecords, contractRenewals, documents };
    });
  }

  createAssignmentHistory(
    tenantId: string,
    data: Omit<Prisma.EmployeeAssignmentHistoryUncheckedCreateInput, "tenantId">,
  ): Promise<EmployeeAssignmentHistory> {
    return this.prisma.withTenant(tenantId, (tx) => tx.employeeAssignmentHistory.create({ data: { ...data, tenantId } }));
  }

  createProbation(tenantId: string, employeeId: string, dto: CreateProbationDto): Promise<ProbationRecord> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.probationRecord.create({
        data: { tenantId, employeeId, startDate: new Date(dto.startDate), endDate: new Date(dto.endDate) },
      }),
    );
  }

  findProbationById(tenantId: string, id: string): Promise<ProbationRecord | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.probationRecord.findFirst({ where: { id, tenantId } }));
  }

  decideProbation(
    tenantId: string,
    id: string,
    data: { status: string; decisionNote?: string; extendedUntil?: Date },
  ): Promise<ProbationRecord> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.probationRecord.update({ where: { id }, data: { ...data, decisionDate: new Date() } }),
    );
  }

  createContractRenewal(
    tenantId: string,
    employeeId: string,
    previousEndDate: Date | null,
    dto: CreateContractRenewalDto,
    renewedByUserId: string,
  ): Promise<ContractRenewal> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.contractRenewal.create({
        data: {
          tenantId,
          employeeId,
          previousEndDate,
          newEndDate: new Date(dto.newEndDate),
          note: dto.note,
          renewedByUserId,
        },
      }),
    );
  }

  createDocument(tenantId: string, employeeId: string, dto: CreateEmployeeDocumentDto): Promise<EmployeeDocument> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.employeeDocument.create({
        data: {
          tenantId,
          employeeId,
          documentType: dto.documentType,
          title: dto.title,
          referenceUrl: dto.referenceUrl,
          fileId: dto.fileId,
        },
      }),
    );
  }
}
