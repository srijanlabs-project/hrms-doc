import { useAuth } from "../auth/AuthProvider";
import { NumberSeriesPanel } from "./NumberSeriesPanel";
import { SystemSettingsPanel } from "./SystemSettingsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * W0·E28 Administration: config/admin console (task tracker #70/#116). Fills
 * the previously-disabled "Settings" nav slot with the two concrete,
 * buildable sub-capabilities from docs/03-module-specifications/28-
 * administration.md — system settings and number series — deferring the
 * larger dynamic-field/masters/localization/branding framework since no
 * current consumer needs per-tenant custom fields or multi-locale UI.
 */
export function AdminConsolePage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        The admin console is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-ink-muted">Tenant-wide system settings and number series configuration.</p>
      </header>

      <SystemSettingsPanel />
      <NumberSeriesPanel />
    </div>
  );
}
