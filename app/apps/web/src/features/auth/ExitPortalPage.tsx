import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { logout } from "../../lib/api/auth";
import { getMyExitSummary } from "../../lib/api/exit";
import { useAuth } from "./AuthProvider";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function money(value: number | null): string {
  return value === null ? "—" : `₹${value.toLocaleString("en-IN")}`;
}

function formatDate(value: string | null): string {
  return value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";
}

/**
 * v1 slice of docs/08-submodule-specifications/02-people-management/13-exit.md:
 * the one screen a Separated/Archived employee can reach — ExitStatusGuard
 * 403s every other route. No document downloads (relieving letter, Form 16),
 * no F&F-settlement status, no alumni network — just identity, exit facts,
 * and payslip history, matching what the backend's ExitService returns.
 */
export function ExitPortalPage() {
  const { clear } = useAuth();
  const navigate = useNavigate();
  const summary = useQuery({ queryKey: ["exit-my-summary"], queryFn: getMyExitSummary });

  async function handleLogout() {
    await logout();
    clear();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <img src="/staffsy-logo.png" alt="Staffsy" className="h-6 w-auto" />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold hover:bg-canvas"
          >
            Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-8">
        {summary.isLoading && <p className="text-ink-muted">Loading…</p>}

        {summary.data && (
          <>
            <Card title="Your Access Is Now Limited">
              <p className="mb-4 text-ink-muted">
                {summary.data.legalName}, your access to Staffsy is limited following your exit from the
                organization. This page shows the information relevant to your departure. Contact HR if you
                have questions.
              </p>
              <dl className="divide-y divide-border text-sm">
                <div className="flex justify-between py-2">
                  <dt className="text-ink-muted">Employee Code</dt>
                  <dd>{summary.data.employeeCode}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink-muted">Department</dt>
                  <dd>{summary.data.department ?? "—"}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-ink-muted">Last Working Day</dt>
                  <dd>{formatDate(summary.data.lastWorkingDay)}</dd>
                </div>
                {summary.data.exitReason && (
                  <div className="flex justify-between py-2">
                    <dt className="text-ink-muted">Reason</dt>
                    <dd>{summary.data.exitReason}</dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card title="Payslip History">
              {summary.data.payslips.length === 0 && (
                <p className="text-ink-muted">No approved payslips are available.</p>
              )}
              <ul className="divide-y divide-border">
                {summary.data.payslips.map((p) => (
                  <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                    <span>
                      {MONTH_NAMES[p.payrollRun.periodMonth - 1]} {p.payrollRun.periodYear}
                    </span>
                    <span className="font-medium">{money(p.netPay)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
