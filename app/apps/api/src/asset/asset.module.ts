import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { AssetAssignmentController } from "./asset-assignment.controller";
import { AssetAssignmentRepository } from "./asset-assignment.repository";
import { AssetController } from "./asset.controller";
import { AssetRepository } from "./asset.repository";
import { AssetService } from "./asset.service";
import { AssetAuditController } from "./audit/audit.controller";
import { AssetAuditRepository } from "./audit/audit.repository";
import { AssetAuditService } from "./audit/audit.service";
import { LicenseController } from "./license/license.controller";
import { LicenseRepository } from "./license/license.repository";
import { LicenseService } from "./license/license.service";
import { MaintenanceController } from "./maintenance/maintenance.controller";
import { MaintenanceRepository } from "./maintenance/maintenance.repository";
import { MaintenanceService } from "./maintenance/maintenance.service";

/** Asset Management, Wave 4 — docs/08-submodule-specifications/18-asset-management/01-asset-assignment.md, 02-asset-return.md. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [AssetController, AssetAssignmentController, MaintenanceController, AssetAuditController, LicenseController],
  providers: [
    AssetService,
    AssetRepository,
    AssetAssignmentRepository,
    MaintenanceService,
    MaintenanceRepository,
    AssetAuditService,
    AssetAuditRepository,
    LicenseService,
    LicenseRepository,
  ],
})
export class AssetModule {}
