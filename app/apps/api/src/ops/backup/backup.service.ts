import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { RequestContextService } from "../../platform/context/request-context.service";
import { NotFoundAppError } from "../../platform/errors/errors";
import { FileStorageService } from "../../platform/files/file-storage.service";
import { StoredFileRepository } from "../../platform/files/stored-file.repository";
import { PrismaService } from "../../platform/prisma/prisma.service";
import { BackupRepository, type BackupSnapshot } from "./backup.repository";

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk as Buffer));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

function tableCountsOf(snapshot: BackupSnapshot): Record<string, number> {
  return Object.fromEntries(Object.entries(snapshot).map(([key, rows]) => [key, rows.length]));
}

/**
 * Postgres's jsonb type does not preserve object key order, so a stored
 * BackupRecord.tableCounts can come back with keys in a different order than
 * a freshly recomputed object — a plain JSON.stringify comparison would then
 * report a false mismatch. Compare sorted-key entries instead.
 */
function countsMatch(a: Record<string, number>, b: Record<string, unknown>): boolean {
  const normalize = (obj: Record<string, unknown>) =>
    JSON.stringify(Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
  return normalize(a) === normalize(b);
}

/**
 * W0·E30 DevOps and Operations — Backup engine. A JSON snapshot of core
 * system-of-record tables, stored through the File Storage engine. Runs
 * nightly for every tenant and can be triggered on demand by an admin,
 * mirroring the Scheduler engine's runDailyCheck()/runForTenant() split.
 */
@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(
    private readonly repository: BackupRepository,
    private readonly fileStorage: FileStorageService,
    private readonly storedFileRepository: StoredFileRepository,
    private readonly requestContext: RequestContextService,
    private readonly prisma: PrismaService,
  ) {}

  private get tenantId(): string {
    return this.requestContext.tenantId!;
  }

  async runNow() {
    return this.runForTenant(this.tenantId, "Manual", this.requestContext.userId);
  }

  /** Internal system job — the only caller allowed to iterate every tenant. */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runNightly(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const { id: tenantId } of tenants) {
      await this.runForTenant(tenantId, "Scheduled");
    }
  }

  private async runForTenant(tenantId: string, triggeredBy: "Manual" | "Scheduled", uploadedByUserId?: string) {
    try {
      const snapshot = await this.repository.snapshotTenant(tenantId);
      const tableCounts = tableCountsOf(snapshot);
      const buffer = Buffer.from(JSON.stringify(snapshot, null, 2), "utf-8");
      const filename = `backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;

      const storageKey = await this.fileStorage.save(tenantId, buffer, filename);
      const file = await this.storedFileRepository.create(tenantId, {
        originalName: filename,
        mimeType: "application/json",
        sizeBytes: buffer.byteLength,
        storageKey,
        uploadedByUserId,
      });

      const record = await this.repository.create(tenantId, { status: "Succeeded", triggeredBy, tableCounts, fileId: file.id });
      this.logger.log(`Tenant ${tenantId}: backup ${record.id} succeeded (${triggeredBy}), ${JSON.stringify(tableCounts)}.`);
      return record;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const record = await this.repository.create(tenantId, { status: "Failed", triggeredBy, tableCounts: {}, errorMessage });
      this.logger.error(`Tenant ${tenantId}: backup ${record.id} failed (${triggeredBy}): ${errorMessage}`);
      return record;
    }
  }

  listRecords() {
    return this.repository.findAll(this.tenantId);
  }

  /**
   * Restore-preview only — re-reads and re-validates a backup file's
   * integrity/contents. Deliberately not a restore-execute: overwriting live
   * multi-tenant data safely needs transactional, foreign-key-ordered
   * writes this pass doesn't build.
   */
  async previewRestore(id: string) {
    const record = await this.repository.findById(this.tenantId, id);
    if (!record) {
      throw new NotFoundAppError("OBJ-BACKUP-RECORD", "Backup record not found.");
    }
    if (!record.file) {
      return { valid: false, reason: "This backup has no associated file (a failed run has nothing to restore)." };
    }
    try {
      const buffer = await streamToBuffer(this.fileStorage.readStream(record.file.storageKey));
      const snapshot = JSON.parse(buffer.toString("utf-8")) as BackupSnapshot;
      const recomputedCounts = tableCountsOf(snapshot);
      const matchesRecordedCounts = countsMatch(recomputedCounts, record.tableCounts as Record<string, unknown>);
      return { valid: true, recomputedCounts, matchesRecordedCounts, snapshotCreatedAt: record.createdAt };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "File is missing or not valid JSON.";
      return { valid: false, reason };
    }
  }
}
