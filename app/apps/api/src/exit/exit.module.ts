import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { ExitController } from "./exit.controller";
import { ExitService } from "./exit.service";

/** Exit self-service, Phase 7 addendum — docs/08-submodule-specifications/02-people-management/13-exit.md. */
@Module({
  imports: [AuthModule, PeopleModule, PayrollModule],
  controllers: [ExitController],
  providers: [ExitService],
})
export class ExitModule {}
