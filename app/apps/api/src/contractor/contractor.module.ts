import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { VendorController } from "./vendor/vendor.controller";
import { VendorRepository } from "./vendor/vendor.repository";
import { VendorService } from "./vendor/vendor.service";
import { WorkerController } from "./worker/worker.controller";
import { WorkerRepository } from "./worker/worker.repository";
import { WorkerService } from "./worker/worker.service";

/**
 * Contractor and External Workforce, Wave 4 W4·E20 —
 * docs/03-module-specifications/20-contractor-external-workforce.md. v1
 * slice: vendors, external workers (with a real approve/suspend/expire
 * state machine and access-grant/revoke timestamps), and compliance
 * documents via the File Storage engine. Entire module is org_admin/hr_ops
 * only — external workers have no Staffsy login. See schema.prisma's
 * ExternalWorker comment for what's collapsed.
 */
@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [VendorController, WorkerController],
  providers: [VendorService, VendorRepository, WorkerService, WorkerRepository],
})
export class ContractorModule {}
