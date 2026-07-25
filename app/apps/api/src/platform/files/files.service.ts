import { Injectable } from "@nestjs/common";
import { RequestContextService } from "../context/request-context.service";
import { AuthenticationAppError, NotFoundAppError } from "../errors/errors";
import { FileStorageService } from "./file-storage.service";
import { StoredFileRepository } from "./stored-file.repository";

export interface UploadableFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

/**
 * File Storage engine service. Any module that needs a real upload (rather
 * than a bare reference URL) calls upload() and stores the returned id as a
 * foreign key — see EmployeeDocument.fileId / IdentityDocument.fileId for the
 * first consumers.
 */
@Injectable()
export class FilesService {
  constructor(
    private readonly repository: StoredFileRepository,
    private readonly storage: FileStorageService,
    private readonly requestContext: RequestContextService,
  ) {}

  async upload(file: UploadableFile) {
    const { tenantId, userId } = this.requireAuthenticated();
    const storageKey = await this.storage.save(tenantId, file.buffer, file.originalname);
    return this.repository.create(tenantId, {
      originalName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey,
      uploadedByUserId: userId,
    });
  }

  async getForDownload(id: string) {
    const { tenantId } = this.requireAuthenticated();
    const file = await this.repository.findById(tenantId, id);
    if (!file) {
      throw new NotFoundAppError("OBJ-FILE", "File not found.");
    }
    return { file, stream: this.storage.readStream(file.storageKey) };
  }

  private requireAuthenticated(): { tenantId: string; userId: string } {
    const { tenantId, userId } = this.requestContext.store ?? {};
    if (!tenantId || !userId) {
      throw new AuthenticationAppError(this.requestContext.correlationId);
    }
    return { tenantId, userId };
  }
}
