import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
import { AiModule } from "./ai/ai.module";
import { AssetModule } from "./asset/asset.module";
import { AttendanceModule } from "./attendance/attendance.module";
import { AuthModule } from "./auth/auth.module";
import { DelegationModule } from "./auth/delegation/delegation.module";
import { CompensationPlanningModule } from "./compensation-planning/compensation-planning.module";
import { ComplianceModule } from "./compliance/compliance.module";
import { CommunicationModule } from "./communication/communication.module";
import { ContractorModule } from "./contractor/contractor.module";
import { DocumentModule } from "./document/document.module";
import { ExitModule } from "./exit/exit.module";
import { ExpenseModule } from "./expense/expense.module";
import { ExperienceModule } from "./experience/experience.module";
import { HelpdeskModule } from "./helpdesk/helpdesk.module";
import { LeaveModule } from "./leave/leave.module";
import { LearningModule } from "./learning/learning.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { OrgModule } from "./org/org.module";
import { PayrollModule } from "./payroll/payroll.module";
import { PeopleModule } from "./people/people.module";
import { PerformanceModule } from "./performance/performance.module";
import { ContextModule } from "./platform/context/context.module";
import { RequestContextMiddleware } from "./platform/context/request-context.middleware";
import { AuditModule } from "./platform/audit/audit.module";
import { DocumentGenerationModule } from "./platform/document-generation/document-generation.module";
import { AllExceptionsFilter } from "./platform/errors/all-exceptions.filter";
import { FilesModule } from "./platform/files/files.module";
import { NumberSeriesModule } from "./platform/number-series/number-series.module";
import { SchedulerModule } from "./platform/scheduler/scheduler.module";
import { SystemSettingModule } from "./platform/system-setting/system-setting.module";
import { PlatformModule } from "./platform/platform.module";
import { PrismaModule } from "./platform/prisma/prisma.module";
import { RecruitmentModule } from "./recruitment/recruitment.module";
import { MssModule } from "./mss/mss.module";
import { RequestsHubModule } from "./requests-hub/requests-hub.module";
import { ReportsModule } from "./reports/reports.module";
import { HealthSafetyModule } from "./health-safety/health-safety.module";
import { TalentModule } from "./talent/talent.module";
import { TravelModule } from "./travel/travel.module";
import { WebhookModule } from "./webhook/webhook.module";
import { WorkforceModule } from "./workforce/workforce.module";
import { WorkplaceModule } from "./workplace/workplace.module";

/**
 * Staffsy modular monolith. Modules mirror the service boundaries defined in
 * docs/06-cross-cutting-specs/08-service-topology-and-deployment-architecture.md.
 * Domain modules (org, people, leave, attendance, payroll, workflow) are added
 * here as their build waves start. AuthGuard/RolesGuard are registered as
 * global APP_GUARD providers inside AuthModule itself (see its comment) so
 * their dependencies resolve in the module that actually provides them.
 */
@Module({
  imports: [
    PrismaModule,
    ContextModule,
    AuthModule,
    DelegationModule,
    PlatformModule,
    FilesModule,
    AuditModule,
    NumberSeriesModule,
    SystemSettingModule,
    DocumentGenerationModule,
    SchedulerModule,
    OrgModule,
    PeopleModule,
    NotificationsModule,
    LeaveModule,
    AttendanceModule,
    PayrollModule,
    OnboardingModule,
    RecruitmentModule,
    ReportsModule,
    AiModule,
    PerformanceModule,
    LearningModule,
    TalentModule,
    CompensationPlanningModule,
    ExitModule,
    ExpenseModule,
    ExperienceModule,
    HelpdeskModule,
    ContractorModule,
    CommunicationModule,
    TravelModule,
    AssetModule,
    RequestsHubModule,
    MssModule,
    WorkforceModule,
    ComplianceModule,
    WebhookModule,
    WorkplaceModule,
    HealthSafetyModule,
    DocumentModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes("*");
  }
}
