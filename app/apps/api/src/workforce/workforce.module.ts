import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { DelegationModule } from "../auth/delegation/delegation.module";
import { LeaveLedgerRepository } from "../leave/ledger/leave-ledger.repository";
import { LeavePolicyRepository } from "../leave/policy/leave-policy.repository";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { FlexController } from "./flex/flex.controller";
import { FlexRepository } from "./flex/flex.repository";
import { FlexService } from "./flex/flex.service";
import { OvertimeController } from "./overtime/overtime.controller";
import { OvertimeRepository } from "./overtime/overtime.repository";
import { OvertimeService } from "./overtime/overtime.service";
import { RosterController } from "./roster/roster.controller";
import { RosterRepository } from "./roster/roster.repository";
import { RosterService } from "./roster/roster.service";
import { RotationController } from "./rotation/rotation.controller";
import { RotationRepository } from "./rotation/rotation.repository";
import { RotationService } from "./rotation/rotation.service";
import { ShiftController } from "./shift/shift.controller";
import { ShiftRepository } from "./shift/shift.repository";
import { ShiftService } from "./shift/shift.service";
import { TimesheetController } from "./timesheet/timesheet.controller";
import { TimesheetRepository } from "./timesheet/timesheet.repository";
import { TimesheetService } from "./timesheet/timesheet.service";

/**
 * Wave 2 W2·E07 Workforce Management — docs/08-submodule-specifications/07-workforce-management/.
 * Shift templates + effective-dated assignment, a consolidated roster/scheduling
 * entry with swap requests, timesheets, overtime (with Payable/CompOff
 * settlement — CompOff reuses the Leave module's ledger, see OvertimeService),
 * flexible hours (policy + standing assignment, compliance evaluated in
 * AttendanceService against self-reported check-in/check-out times), and
 * shift rotation (weekly cycling pattern that materializes real RosterEntry
 * rows via RosterRepository). Attendance (01) already exists from Phase 5;
 * biometric integration (02) is a deliberate deferral — this build has no
 * hardware/device-capture channel to interpret honestly.
 */
@Module({
  imports: [AuthModule, DelegationModule, PeopleModule, PayrollModule],
  controllers: [ShiftController, RosterController, TimesheetController, OvertimeController, FlexController, RotationController],
  providers: [
    ShiftService,
    ShiftRepository,
    RosterService,
    RosterRepository,
    TimesheetService,
    TimesheetRepository,
    OvertimeService,
    OvertimeRepository,
    LeaveLedgerRepository,
    LeavePolicyRepository,
    FlexService,
    FlexRepository,
    RotationService,
    RotationRepository,
  ],
  exports: [ShiftService],
})
export class WorkforceModule {}
