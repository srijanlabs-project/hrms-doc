import { useAuth } from "../auth/AuthProvider";
import { BonusEligibilityPanel } from "./BonusEligibilityPanel";
import { ComplianceObligationsPanel } from "./ComplianceObligationsPanel";
import { ComplianceTasksPanel } from "./ComplianceTasksPanel";
import { LwfLiabilityPanel } from "./LwfLiabilityPanel";
import { MinimumWageCheckPanel } from "./MinimumWageCheckPanel";
import { StatutorySettingsForm } from "./StatutorySettingsForm";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 2 W2·E10 Statutory and Compliance deepening — 05-compliance-calendar.md.
 * Ties directly to the PF/ESIC/TDS/PT figures payroll already computes each
 * run: this tracks the obligation to actually file/pay them. Country-specific
 * compliance stays deferred — single-jurisdiction tenant, no second country
 * to build a rule-pack abstraction against.
 */
export function ComplianceCalendarPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Statutory compliance is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Statutory Compliance</h1>
        <p className="text-ink-muted">Track recurring statutory filing and payment obligations.</p>
      </header>

      <ComplianceObligationsPanel />
      <ComplianceTasksPanel />

      <header>
        <h2 className="text-xl font-bold">Computed Statutory Checks</h2>
        <p className="text-ink-muted">Gratuity is computed per-employee in Full &amp; Final Settlement. These ride live compensation data.</p>
      </header>
      <StatutorySettingsForm />
      <MinimumWageCheckPanel />
      <LwfLiabilityPanel />
      <BonusEligibilityPanel />
    </div>
  );
}
