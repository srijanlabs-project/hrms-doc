import { Module } from "@nestjs/common";
import { FilesModule } from "../platform/files/files.module";
import { BackupController } from "./backup/backup.controller";
import { BackupRepository } from "./backup/backup.repository";
import { BackupService } from "./backup/backup.service";

/** W0·E30 DevOps and Operations. FilesModule import gives BackupService the FileStorageService/StoredFileRepository it needs to write and register snapshot files. */
@Module({
  imports: [FilesModule],
  controllers: [BackupController],
  providers: [BackupService, BackupRepository],
})
export class OpsModule {}
