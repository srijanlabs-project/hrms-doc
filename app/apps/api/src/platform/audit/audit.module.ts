import { Global, Module } from "@nestjs/common";
import { AuditController } from "./audit.controller";
import { AuditLogRepository } from "./audit-log.repository";
import { AuditService } from "./audit.service";

/** Foundation & Platform (E00) — Audit Engine. Global so any module can inject AuditService without re-importing it, matching PrismaModule/ContextModule. */
@Global()
@Module({
  controllers: [AuditController],
  providers: [AuditService, AuditLogRepository],
  exports: [AuditService],
})
export class AuditModule {}
