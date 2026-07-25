import { Module } from "@nestjs/common";
import { AttendanceModule } from "../attendance/attendance.module";
import { LeaveModule } from "../leave/leave.module";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { AiDataService } from "./ai-data.service";
import { AI_PROVIDER } from "./ai-provider.interface";
import { StaticDevAiProvider } from "./static-dev-ai-provider";

/**
 * Ridz AI-gateway, Phase 6 — docs/03-module-specifications/26-ai-copilot.md.
 * See StaticDevAiProvider's comment for the OTP-style swap-in contract:
 * this dev provider needs no ANTHROPIC_API_KEY or external call. Real Claude
 * API integration is a separate provider implementation behind the same
 * AI_PROVIDER token, using AiDataService as its tool layer.
 */
@Module({
  imports: [PeopleModule, LeaveModule, AttendanceModule, PayrollModule],
  controllers: [AiController],
  providers: [AiService, AiDataService, { provide: AI_PROVIDER, useClass: StaticDevAiProvider }],
})
export class AiModule {}
