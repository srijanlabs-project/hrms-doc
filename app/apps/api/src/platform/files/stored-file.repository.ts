import { Injectable } from "@nestjs/common";
import type { StoredFile } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export interface CreateStoredFileInput {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  uploadedByUserId?: string;
}

@Injectable()
export class StoredFileRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: CreateStoredFileInput): Promise<StoredFile> {
    return this.prisma.withTenant(tenantId, (tx) => tx.storedFile.create({ data: { tenantId, ...data } }));
  }

  findById(tenantId: string, id: string): Promise<StoredFile | null> {
    return this.prisma.withTenant(tenantId, (tx) => tx.storedFile.findFirst({ where: { id } }));
  }
}
