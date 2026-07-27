import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/AuthProvider";
import { DataImportPanel } from "./DataImportPanel";
import { GoLiveChecklistPanel } from "./GoLiveChecklistPanel";
import { ImportHistoryPanel } from "./ImportHistoryPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W0·E31 Implementation and Migration — a configurable, multi-module data
 * import engine (Employee, Department, LegalEntity, LeavePolicy today) for
 * migrating data from a legacy system, reusing each module's existing
 * create(dto) service rather than a parallel per-entity bulk path. Import
 * runs get real history and a real rollback (undoes a bad batch by
 * soft-deleting what it created). Migration-mapping templates, staging-
 * environment cutover, and multi-environment handover stay deferred — no
 * second environment or legacy system exists here to migrate between.
 */
export function ImplementationHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Implementation and Migration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Implementation &amp; Migration</h1>
        <p className="text-ink-muted">Import legacy-system data across modules, track history, and manage onboarding setup.</p>
      </header>

      <DataImportPanel onCommitted={() => void queryClient.invalidateQueries({ queryKey: ["import-batches"] })} />
      <ImportHistoryPanel />
      <GoLiveChecklistPanel />
    </div>
  );
}
