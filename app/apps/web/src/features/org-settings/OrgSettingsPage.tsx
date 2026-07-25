import { useAuth } from "../auth/AuthProvider";
import { CompanySection } from "./CompanySection";
import { FinancialCenterSection } from "./FinancialCenterSection";
import { GradeSection } from "./GradeSection";
import { JobArchitectureSection } from "./JobArchitectureSection";
import { OrgTreeSection } from "./OrgTreeSection";
import { OrgUnitSection } from "./OrgUnitSection";
import { PolicySection } from "./PolicySection";
import { PositionSection } from "./PositionSection";
import { ReportingLineSection } from "./ReportingLineSection";
import { WorkCalendarSection } from "./WorkCalendarSection";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 1 Org Management deepening (task tracker #75): Company, Org Units,
 * Financial Centers, Job Architecture, Grades, Positions, Reporting Lines,
 * Work Calendars, and Policies — everything beyond the Phase 2 legal-entity/
 * department proving slice. Stands in for the not-yet-designed T-016
 * Organization Explorer board, same interim-pattern precedent as Department
 * reusing T-003 in Phase 2 — never invents a bespoke visual language, just
 * reuses the established Card/list/form pattern from every other admin page
 * in this build.
 */
export function OrgSettingsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Organization settings are restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-ink-muted">
          Manage the full organization structure: companies, business units, financial centers, job architecture,
          positions, calendars, and policies.
        </p>
      </header>

      <OrgTreeSection />
      <CompanySection />
      <OrgUnitSection />
      <FinancialCenterSection />
      <JobArchitectureSection />
      <GradeSection />
      <PositionSection />
      <ReportingLineSection />
      <WorkCalendarSection />
      <PolicySection />
    </div>
  );
}
