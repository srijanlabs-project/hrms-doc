import { VendorPanel } from "./VendorPanel";
import { WorkerPanel } from "./WorkerPanel";

/**
 * Contractor and External Workforce — docs/03-module-specifications/20-contractor-external-workforce.md.
 * Admin-only (org_admin/hr_ops) — external workers have no Staffsy login of
 * their own, so there is no self-service surface to build. See
 * schema.prisma's ExternalWorker comment for what's collapsed/deferred.
 */
export function ContractorPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Contractor & External Workforce</h1>
        <p className="text-ink-muted">Manage vendors, contractors, and agency staff through onboarding, access, and exit.</p>
      </header>

      <VendorPanel />
      <WorkerPanel />
    </div>
  );
}
