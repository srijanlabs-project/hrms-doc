import { Module } from "@nestjs/common";
import { PeopleModule } from "../people/people.module";
import { FlexRepository } from "../workforce/flex/flex.repository";
import { AttendanceController } from "./attendance.controller";
import { AttendanceRepository } from "./attendance.repository";
import { AttendanceService } from "./attendance.service";

/**
 * Attendance module, Phase 5 — docs/08-submodule-specifications/07-workforce-management/01-attendance.md.
 * FlexRepository is declared directly here (not imported via WorkforceModule)
 * to avoid a module cycle — WorkforceModule imports PayrollModule, which
 * already imports this module for payable-days calculation.
 */
@Module({
  imports: [PeopleModule],
  controllers: [AttendanceController],
  providers: [AttendanceService, AttendanceRepository, FlexRepository],
  exports: [AttendanceRepository, AttendanceService],
})
export class AttendanceModule {}
