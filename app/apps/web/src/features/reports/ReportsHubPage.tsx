import { useQuery } from "@tanstack/react-query";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { useAuth } from "../auth/AuthProvider";
import { getReportsSummary } from "../../lib/api/reports";

const REPORTS_ADMIN_ROLES = ["org_admin", "hr_ops"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * Reports Hub / org admin dashboard, Phase 6 — a fixed set of live KPI
 * queries across every module built so far (docs/07-appendices/40-reports-and-dashboards-master-inventory.md),
 * not the configurable report-builder engine from
 * docs/08-submodule-specifications/25-analytics-and-bi/04-custom-reports.md.
 * No saved reports, filters, or export in v1.
 */
export function ReportsHubPage() {
  const { user } = useAuth();
  const isAdmin = REPORTS_ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const summary = useQuery({ queryKey: ["reports-summary"], queryFn: getReportsSummary, enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Reports are restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  if (summary.isLoading) {
    return <p className="text-ink-muted">Loading reports…</p>;
  }

  const data = summary.data;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Reports Hub</h1>
        <p className="text-ink-muted">Organization-wide snapshot across people, attendance, leave, recruitment, and payroll.</p>
      </header>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Headcount" value={String(data.headcount.total)} caption={`${data.headcount.active} Active`} />
        <KpiCard
          label="Attendance Today"
          value={String(data.attendanceToday.Present)}
          caption={`${data.attendanceToday.notMarked} not marked`}
        />
        <KpiCard label="Pending Leave" value={String(data.leave.pendingRequests)} caption="Awaiting approval" />
        <KpiCard
          label="Payroll Cost"
          value={data.payrollCost ? `₹${data.payrollCost.totalNetPay.toLocaleString("en-IN")}` : "—"}
          caption={data.payrollCost ? `${MONTH_NAMES[data.payrollCost.periodMonth - 1]} ${data.payrollCost.periodYear}` : "No closed run yet"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Headcount by Status">
          <ul className="space-y-2">
            {Object.entries(data.headcount.byStatus).map(([status, count]) => (
              <li key={status} className="flex justify-between text-sm">
                <span className="text-ink-muted">{status}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Recruitment Funnel">
          <ul className="space-y-2">
            <li className="flex justify-between text-sm">
              <span className="text-ink-muted">Open Requisitions</span>
              <span className="font-semibold">{data.recruitment.openRequisitions}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-ink-muted">Open Headcount Demand</span>
              <span className="font-semibold">{data.recruitment.openHeadcountDemand}</span>
            </li>
            {Object.entries(data.recruitment.applicationsByStage).map(([stage, count]) => (
              <li key={stage} className="flex justify-between text-sm">
                <span className="text-ink-muted">{stage} Applications</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Onboarding Readiness">
          <ul className="space-y-2">
            <li className="flex justify-between text-sm">
              <span className="text-ink-muted">In Progress</span>
              <span className="font-semibold">{data.onboarding.inProgress}</span>
            </li>
            <li className="flex justify-between text-sm">
              <span className="text-ink-muted">Activated</span>
              <span className="font-semibold">{data.onboarding.activated}</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
