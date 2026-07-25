import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { PipelinePanel } from "./PipelinePanel";
import { RequisitionsPanel } from "./RequisitionsPanel";

const RECRUITMENT_ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Recruitment & ATS, Phase 6 — docs/03-module-specifications/06-recruitment-ats.md.
 * No candidate-facing portal or recruiter/hiring-manager permission split in
 * v1 — the whole surface is org_admin/hr_ops, same authorization model as
 * PayrollWorkspacePage. Backend already 403s everyone else; this gate just
 * avoids firing those calls and shows a clearer message instead.
 */
export function RecruitmentPage() {
  const { user } = useAuth();
  const [selectedRequisitionId, setSelectedRequisitionId] = useState<string | null>(null);
  const isAdmin = RECRUITMENT_ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Recruitment administration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Recruitment</h1>
        <p className="text-ink-muted">Manage requisitions, candidate pipelines, and offers.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <RequisitionsPanel selectedId={selectedRequisitionId} onSelect={setSelectedRequisitionId} />
        {selectedRequisitionId ? (
          <PipelinePanel requisitionId={selectedRequisitionId} />
        ) : (
          <div className="flex items-center justify-center rounded-(--radius-card) border border-dashed border-border p-8 text-ink-muted">
            Select a requisition to see its candidate pipeline.
          </div>
        )}
      </div>
    </div>
  );
}
