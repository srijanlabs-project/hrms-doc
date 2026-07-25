import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { CalibrationSessionDetail } from "./CalibrationSessionDetail";
import { CalibrationSessionsPanel } from "./CalibrationSessionsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Calibration — docs/08-submodule-specifications/11-performance-management/04-calibration.md.
 * v1: Draft -> InSession -> Closed, cohort is a free-text label + periodYear,
 * no distribution-guidance bands or cohort-comparison views. Committee-only
 * (org_admin/hr_ops).
 */
export function CalibrationPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Calibration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Calibration</h1>
        <p className="text-ink-muted">Review and adjust proposed appraisal ratings for fairness and consistency.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <CalibrationSessionsPanel selectedId={selectedId} onSelect={setSelectedId} />
        {selectedId ? (
          <CalibrationSessionDetail sessionId={selectedId} />
        ) : (
          <div className="flex items-center justify-center rounded-(--radius-card) border border-dashed border-border p-8 text-ink-muted">
            Select a session to review its cases.
          </div>
        )}
      </div>
    </div>
  );
}
