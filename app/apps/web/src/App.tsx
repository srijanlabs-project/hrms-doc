import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";
import { AttendancePage } from "./features/attendance/AttendancePage";
import { AdminConsolePage } from "./features/admin/AdminConsolePage";
import { WorkforceAnalyticsPage } from "./features/analytics/WorkforceAnalyticsPage";
import { CustomReportBuilderPage } from "./features/analytics/CustomReportBuilderPage";
import { AuditLogPage } from "./features/security/AuditLogPage";
import { AccessReviewPage } from "./features/security/AccessReviewPage";
import { OpsPage } from "./features/ops/OpsPage";
import { ImplementationHubPage } from "./features/implementation/ImplementationHubPage";
import { LoginPage } from "./features/auth/LoginPage";
import { ProvisionTenantPage } from "./features/auth/ProvisionTenantPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { BulkImportPage } from "./features/employees/BulkImportPage";
import { ContractorPage } from "./features/contractor/ContractorPage";
import { AnnouncementsPage } from "./features/communication/AnnouncementsPage";
import { EmployeeDirectoryPage } from "./features/employees/EmployeeDirectoryPage";
import { EmployeeProfilePage } from "./features/employees/EmployeeProfilePage";
import { MyProfilePage } from "./features/employees/MyProfilePage";
import { BenefitsPage } from "./features/compensation-planning/BenefitsPage";
import { CompensationPlanningPage } from "./features/compensation-planning/CompensationPlanningPage";
import { ComplianceCalendarPage } from "./features/compliance/ComplianceCalendarPage";
import { IntegrationPlatformPage } from "./features/integration/IntegrationPlatformPage";
import { ExpenseHubPage } from "./features/expense/ExpenseHubPage";
import { ExperiencePage } from "./features/experience/ExperiencePage";
import { HelpdeskPage } from "./features/helpdesk/HelpdeskPage";
import { HealthSafetyHubPage } from "./features/health-safety/HealthSafetyHubPage";
import { DocumentManagementHubPage } from "./features/document/DocumentManagementHubPage";
import { AssetsHubPage } from "./features/asset/AssetsHubPage";
import { ApplyLeaveForm } from "./features/leave/ApplyLeaveForm";
import { ApprovalsPage } from "./features/leave/ApprovalsPage";
import { LeaveCalendarPage } from "./features/leave/LeaveCalendarPage";
import { LeaveHubPage } from "./features/leave/LeaveHubPage";
import { LearningCatalogPage } from "./features/learning/LearningCatalogPage";
import { MyLearningPage } from "./features/learning/MyLearningPage";
import { OnboardingControlCenterPage } from "./features/onboarding/OnboardingControlCenterPage";
import { OnboardingHomePage } from "./features/onboarding/OnboardingHomePage";
import { OrgSettingsPage } from "./features/org-settings/OrgSettingsPage";
import { PayrollWorkspacePage } from "./features/payroll/PayrollWorkspacePage";
import { PayslipsPage } from "./features/payroll/PayslipsPage";
import { AppraisalPage } from "./features/performance/AppraisalPage";
import { CalibrationPage } from "./features/performance/CalibrationPage";
import { CertificationsPage } from "./features/learning/CertificationsPage";
import { Feedback360Page } from "./features/performance/Feedback360Page";
import { CompetenciesPage } from "./features/performance/CompetenciesPage";
import { CheckInsPage } from "./features/performance/CheckInsPage";
import { GoalsPage } from "./features/performance/GoalsPage";
import { RecruitmentPage } from "./features/recruitment/RecruitmentPage";
import { ReferralPage } from "./features/recruitment/ReferralPage";
import { InternalMobilityPage } from "./features/recruitment/InternalMobilityPage";
import { ReportsHubPage } from "./features/reports/ReportsHubPage";
import { RequestsHubPage } from "./features/requests/RequestsHubPage";
import { SecurityPage } from "./features/security/SecurityPage";
import { TeamDashboardPage } from "./features/team/TeamDashboardPage";
import { SuccessionPlanningPage } from "./features/talent/SuccessionPlanningPage";
import { TalentGridPage } from "./features/talent/TalentGridPage";
import { TravelHubPage } from "./features/travel/TravelHubPage";
import { WorkforceHubPage } from "./features/workforce/WorkforceHubPage";
import { WorkplaceHubPage } from "./features/workplace/WorkplaceHubPage";
import { MyStaffsyPage } from "./pages/MyStaffsyPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/platform/provision" element={<ProvisionTenantPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<MyStaffsyPage />} />
          <Route path="/people/employees" element={<EmployeeDirectoryPage />} />
          <Route path="/people/employees/:id" element={<EmployeeProfilePage />} />
          <Route path="/profile" element={<MyProfilePage />} />
          <Route path="/leave" element={<LeaveHubPage />} />
          <Route path="/leave/apply" element={<ApplyLeaveForm />} />
          <Route path="/leave/calendar" element={<LeaveCalendarPage />} />
          <Route path="/approvals" element={<ApprovalsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/payroll" element={<PayrollWorkspacePage />} />
          <Route path="/payslips" element={<PayslipsPage />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/recruitment/refer" element={<ReferralPage />} />
          <Route path="/recruitment/internal-jobs" element={<InternalMobilityPage />} />
          <Route path="/onboarding" element={<OnboardingHomePage />} />
          <Route path="/onboarding/cases" element={<OnboardingControlCenterPage />} />
          <Route path="/reports" element={<ReportsHubPage />} />
          <Route path="/reports/analytics" element={<WorkforceAnalyticsPage />} />
          <Route path="/reports/custom" element={<CustomReportBuilderPage />} />
          <Route path="/people/employees/bulk-import" element={<BulkImportPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/performance" element={<AppraisalPage />} />
          <Route path="/performance/360" element={<Feedback360Page />} />
          <Route path="/performance/competencies" element={<CompetenciesPage />} />
          <Route path="/performance/check-ins" element={<CheckInsPage />} />
          <Route path="/performance/calibration" element={<CalibrationPage />} />
          <Route path="/learning" element={<LearningCatalogPage />} />
          <Route path="/learning/my" element={<MyLearningPage />} />
          <Route path="/learning/certifications" element={<CertificationsPage />} />
          <Route path="/talent" element={<TalentGridPage />} />
          <Route path="/talent/succession" element={<SuccessionPlanningPage />} />
          <Route path="/compensation-planning" element={<CompensationPlanningPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/helpdesk" element={<HelpdeskPage />} />
          <Route path="/contractors" element={<ContractorPage />} />
          <Route path="/communications" element={<AnnouncementsPage />} />
          <Route path="/expenses" element={<ExpenseHubPage />} />
          <Route path="/travel" element={<TravelHubPage />} />
          <Route path="/assets" element={<AssetsHubPage />} />
          <Route path="/organization" element={<OrgSettingsPage />} />
          <Route path="/settings" element={<AdminConsolePage />} />
          <Route path="/security/audit-logs" element={<AuditLogPage />} />
          <Route path="/security/access-reviews" element={<AccessReviewPage />} />
          <Route path="/ops" element={<OpsPage />} />
          <Route path="/implementation" element={<ImplementationHubPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/requests" element={<RequestsHubPage />} />
          <Route path="/team" element={<TeamDashboardPage />} />
          <Route path="/workforce" element={<WorkforceHubPage />} />
          <Route path="/compliance" element={<ComplianceCalendarPage />} />
          <Route path="/integrations" element={<IntegrationPlatformPage />} />
          <Route path="/workplace" element={<WorkplaceHubPage />} />
          <Route path="/health-safety" element={<HealthSafetyHubPage />} />
          <Route path="/documents" element={<DocumentManagementHubPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
