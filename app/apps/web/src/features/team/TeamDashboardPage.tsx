import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { KpiCard } from "../../components/ui/KpiCard";
import { getTeamDashboard } from "../../lib/api/team-dashboard";
import { useAuth } from "../auth/AuthProvider";
import { employeeStatusTone } from "../employees/status-tone";
import { PipPanel } from "./PipPanel";
import { TransferPromotionPanel } from "./TransferPromotionPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Manager Self Service (E05) — unified Team Dashboard, 05-team-dashboard.md
 * v1 slice. Aggregates the direct-report roster, pending Leave/Expense/
 * Travel approvals routed to this manager, a live attendance/approval-age
 * analytics tile, and transfer/promotion requests. Performance reviews and
 * hiring approvals tiles stay deferred — no data pipeline exists yet for
 * attrition-risk/staffing-gap alerts the fuller spec envisions.
 */
export function TeamDashboardPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const dashboard = useQuery({ queryKey: ["team-dashboard"], queryFn: getTeamDashboard });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">My Team</h1>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Team Size" value={dashboard.data ? String(dashboard.data.teamSize) : "—"} caption="Direct reports" />
        <KpiCard
          label="Pending Approvals"
          value={dashboard.data ? String(dashboard.data.pendingApprovalCount) : "—"}
          caption="Across Leave/Expense/Travel"
        />
        <KpiCard
          label="Attendance Today"
          value={dashboard.data ? `${dashboard.data.teamAnalytics.attendanceRateToday}%` : "—"}
          caption="Share of team marked Present"
        />
        <KpiCard
          label="Oldest Pending Approval"
          value={dashboard.data ? `${dashboard.data.teamAnalytics.oldestPendingApprovalDays}d` : "—"}
          caption="Days since submission"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Pending Approvals">
          <ul className="space-y-2">
            {dashboard.data?.pendingApprovals.map((a) => (
              <li key={`${a.sourceType}-${a.id}`}>
                <Link
                  to={a.linkPath}
                  className="flex items-center justify-between rounded-lg border border-border p-3 text-sm hover:border-primary hover:bg-primary-soft"
                >
                  <span>
                    <Badge tone="neutral">{a.sourceType}</Badge> <span className="font-medium">{a.employeeName}</span>
                    <span className="block text-xs text-ink-faint">{a.title}</span>
                  </span>
                  <span className="text-xs text-ink-faint">{new Date(a.submittedAt).toLocaleDateString("en-IN")}</span>
                </Link>
              </li>
            ))}
            {dashboard.data?.pendingApprovals.length === 0 && (
              <p className="text-sm text-ink-faint">Nothing pending your approval.</p>
            )}
          </ul>
        </Card>

        <Card title="Team Roster">
          <ul className="space-y-2">
            {dashboard.data?.roster.map((member) => (
              <li key={member.id} className="flex items-center gap-3 rounded-lg border border-border p-2 text-sm">
                <Avatar name={member.legalName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{member.legalName}</div>
                  <div className="truncate text-xs text-ink-faint">
                    {member.department ?? "Unassigned"} · {member.employeeCode}
                  </div>
                </div>
                <Badge tone={employeeStatusTone(member.status)}>{member.status}</Badge>
              </li>
            ))}
            {dashboard.data?.roster.length === 0 && <p className="text-sm text-ink-faint">No direct reports.</p>}
          </ul>
        </Card>
      </div>

      <TransferPromotionPanel roster={dashboard.data?.roster ?? []} isAdmin={isAdmin} />
      <PipPanel roster={dashboard.data?.roster ?? []} isAdmin={isAdmin} />
    </div>
  );
}
