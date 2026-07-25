import { Injectable } from "@nestjs/common";
import type { BankAccount, IdentityDocument, TaxProfile } from "@prisma/client";
import { PrismaService } from "../../platform/prisma/prisma.service";
import type { CreateBankAccountDto } from "./dto/create-bank-account.dto";
import type { CreateIdentityDocumentDto } from "./dto/create-identity-document.dto";
import type { UpsertTaxProfileDto } from "./dto/upsert-tax-profile.dto";

/** Data access only. Every method runs inside PrismaService.withTenant for RLS scoping. */
@Injectable()
export class IdentityFinanceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findIdentityDocuments(tenantId: string, employeeId: string): Promise<IdentityDocument[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.identityDocument.findMany({
        where: { tenantId, employeeId },
        orderBy: { createdAt: "desc" },
        include: { file: { select: { id: true, originalName: true, mimeType: true } } },
      }),
    );
  }

  createIdentityDocument(
    tenantId: string,
    employeeId: string,
    dto: CreateIdentityDocumentDto,
  ): Promise<IdentityDocument> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.identityDocument.create({
        data: {
          tenantId,
          employeeId,
          documentType: dto.documentType,
          documentNumber: dto.documentNumber,
          issuingCountry: dto.issuingCountry,
          expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
          fileId: dto.fileId,
        },
      }),
    );
  }

  findBankAccounts(tenantId: string, employeeId: string): Promise<BankAccount[]> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.bankAccount.findMany({ where: { tenantId, employeeId }, orderBy: { createdAt: "desc" } }),
    );
  }

  async createBankAccount(tenantId: string, employeeId: string, dto: CreateBankAccountDto): Promise<BankAccount> {
    return this.prisma.withTenant(tenantId, async (tx) => {
      if (dto.isPrimary !== false) {
        await tx.bankAccount.updateMany({ where: { tenantId, employeeId, isPrimary: true }, data: { isPrimary: false } });
      }
      return tx.bankAccount.create({
        data: {
          tenantId,
          employeeId,
          accountHolderName: dto.accountHolderName,
          accountNumber: dto.accountNumber,
          ifscCode: dto.ifscCode,
          bankName: dto.bankName,
          branchName: dto.branchName,
          isPrimary: dto.isPrimary ?? true,
        },
      });
    });
  }

  /** For payroll bank-file export — every Active primary account across a batch of employees in one query. */
  findPrimaryForEmployeeIds(tenantId: string, employeeIds: string[]): Promise<BankAccount[]> {
    if (employeeIds.length === 0) return Promise.resolve([]);
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.bankAccount.findMany({ where: { tenantId, employeeId: { in: employeeIds }, isPrimary: true, status: "Active" } }),
    );
  }

  findTaxProfile(tenantId: string, employeeId: string): Promise<TaxProfile | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.taxProfile.findFirst({ where: { tenantId, employeeId } }));
  }

  upsertTaxProfile(tenantId: string, employeeId: string, dto: UpsertTaxProfileDto): Promise<TaxProfile> {
    return this.prisma.withTenant(tenantId, (tx) =>
      tx.taxProfile.upsert({
        where: { employeeId },
        create: { tenantId, employeeId, ...dto },
        update: dto,
      }),
    );
  }
}
