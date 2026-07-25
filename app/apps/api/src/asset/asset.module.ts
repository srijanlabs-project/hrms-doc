import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { PeopleModule } from "../people/people.module";
import { AssetAssignmentController } from "./asset-assignment.controller";
import { AssetAssignmentRepository } from "./asset-assignment.repository";
import { AssetController } from "./asset.controller";
import { AssetRepository } from "./asset.repository";
import { AssetService } from "./asset.service";

/** Asset Management, Wave 4 — docs/08-submodule-specifications/18-asset-management/01-asset-assignment.md, 02-asset-return.md. */
@Module({
  imports: [AuthModule, PeopleModule, NotificationsModule],
  controllers: [AssetController, AssetAssignmentController],
  providers: [AssetService, AssetRepository, AssetAssignmentRepository],
})
export class AssetModule {}
