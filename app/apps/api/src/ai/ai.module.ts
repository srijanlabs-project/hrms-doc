import { Module } from "@nestjs/common";
import { AnalyticsModule } from "../analytics/analytics.module";
import { AttendanceModule } from "../attendance/attendance.module";
import { ExperienceModule } from "../experience/experience.module";
import { LearningModule } from "../learning/learning.module";
import { LeaveModule } from "../leave/leave.module";
import { MssModule } from "../mss/mss.module";
import { PayrollModule } from "../payroll/payroll.module";
import { PeopleModule } from "../people/people.module";
import { RecruitmentModule } from "../recruitment/recruitment.module";
import { TalentModule } from "../talent/talent.module";
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
 *
 * W5·E26 deepening pulls in AnalyticsModule/MssModule/TalentModule/
 * ExperienceModule/LearningModule purely for their read-only services
 * (workforce trend, team dashboard, succession coverage, recognition,
 * mandatory-learning gaps) — see AiDataService for the new tool methods.
 * W5·P gap closure adds RecruitmentModule for the recruiter copilot tool
 * (open requisitions, pipeline stage counts, offers pending decision) —
 * natural language querying stays deferred (see StaticDevAiProvider's
 * comment: real NLQ needs query-parsing/LLM infrastructure this keyword
 * matcher doesn't have).
 */
@Module({
  imports: [
    PeopleModule,
    LeaveModule,
    AttendanceModule,
    PayrollModule,
    AnalyticsModule,
    MssModule,
    TalentModule,
    ExperienceModule,
    LearningModule,
    RecruitmentModule,
  ],
  controllers: [AiController],
  providers: [AiService, AiDataService, { provide: AI_PROVIDER, useClass: StaticDevAiProvider }],
})
export class AiModule {}
