import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { CompensationPanel } from "./CompensationPanel";
import { FnfPanel } from "./FnfPanel";
import { IncentiveBonusPanel } from "./IncentiveBonusPanel";
import { LoanAdvancePanel } from "./LoanAdvancePanel";
import { PayComponentAssignPanel } from "./PayComponentAssignPanel";
import { PayComponentCatalogPanel } from "./PayComponentCatalogPanel";
import { PayrollRunDetail } from "./PayrollRunDetail";
import { PayrollRunsPanel } from "./PayrollRunsPanel";

const PAYROLL_ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * T-006 Payroll Workspace -> mass-ops run cockpit, v1 slice. Board's
 * variance/cost-center/banking-file surfaces are deferred — no data backs
 * them yet (see docs/08-submodule-specifications/09-payroll/05-payroll-processing.md).
 * Backend already 403s non-admins on every call this page makes; this gate
 * just avoids firing those calls and shows a clearer message instead.
 */
export function PayrollWorkspacePage() {
  const { user } = useAuth();
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const isAdmin = PAYROLL_ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Payroll administration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Payroll</h1>
        <p className="text-ink-muted">Manage compensation and run payroll for the organization.</p>
      </header>

      <CompensationPanel />

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <PayrollRunsPanel selectedRunId={selectedRunId} onSelect={setSelectedRunId} />
        {selectedRunId ? (
          <PayrollRunDetail runId={selectedRunId} />
        ) : (
          <div className="flex items-center justify-center rounded-(--radius-card) border border-dashed border-border p-8 text-ink-muted">
            Select a run to see its results.
          </div>
        )}
      </div>

      <PayComponentCatalogPanel />
      <PayComponentAssignPanel />
      <LoanAdvancePanel isAdmin />
      <IncentiveBonusPanel isAdmin />
      <FnfPanel />
    </div>
  );
}
