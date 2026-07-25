import { Module } from "@nestjs/common";
import { FileStorageService } from "./file-storage.service";
import { FilesController } from "./files.controller";
import { FilesService } from "./files.service";
import { StoredFileRepository } from "./stored-file.repository";

/** Foundation & Platform (E00) — File Storage engine. */
@Module({
  controllers: [FilesController],
  providers: [FilesService, FileStorageService, StoredFileRepository],
  exports: [FilesService, StoredFileRepository],
})
export class FilesModule {}
