import { randomUUID } from "node:crypto";
import { createReadStream, type ReadStream } from "node:fs";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Injectable } from "@nestjs/common";

const UPLOAD_ROOT = join(process.cwd(), "uploads");

/**
 * Local-disk adapter for the File Storage engine (Foundation & Platform,
 * E00 — a real catalog gap, no dedicated spec file). storageKey is a
 * tenant-prefixed relative path under UPLOAD_ROOT, kept generic enough that
 * swapping in an object-store adapter later only means changing this class,
 * not any consumer's contract.
 */
@Injectable()
export class FileStorageService {
  async save(tenantId: string, buffer: Buffer, originalName: string): Promise<string> {
    const safeName = originalName.replace(/[/\\]/g, "_");
    const storageKey = `${tenantId}/${randomUUID()}-${safeName}`;
    await mkdir(join(UPLOAD_ROOT, tenantId), { recursive: true });
    await writeFile(join(UPLOAD_ROOT, storageKey), buffer);
    return storageKey;
  }

  readStream(storageKey: string): ReadStream {
    return createReadStream(join(UPLOAD_ROOT, storageKey));
  }

  async delete(storageKey: string): Promise<void> {
    await unlink(join(UPLOAD_ROOT, storageKey)).catch(() => undefined);
  }
}
