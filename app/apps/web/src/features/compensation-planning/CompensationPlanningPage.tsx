import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { CyclesPanel } from "./CyclesPanel";
import { ReviewItemsPanel } from "./ReviewItemsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * v1 slice of docs/08-submodule-specifications/14-compensation-and-benefits/03-merit-cycles.md:
 * one cycle per period, propose/approve/apply only. Backend already 403s
 * non-admins on every call this page makes; this gate just avoids firing
 * those calls and shows a clearer message instead (same pattern as
 * PayrollWorkspacePage).
 */
export function CompensationPlanningPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const [selectedCycleId, setSelectedCycleId] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Compensation planning is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Compensation Planning</h1>
        <p className="text-ink-muted">Run a merit review cycle: propose, approve, and apply pay changes.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <CyclesPanel selectedCycleId={selectedCycleId} onSelect={setSelectedCycleId} />
        {selectedCycleId ? (
          <ReviewItemsPanel cycleId={selectedCycleId} />
        ) : (
          <div className="flex items-center justify-center rounded-(--radius-card) border border-dashed border-border p-8 text-ink-muted">
            Select or create a cycle to see its review items.
          </div>
        )}
      </div>
    </div>
  );
}
