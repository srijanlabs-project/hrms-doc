import { useAuth } from "../auth/AuthProvider";
import { WebhookDeliveriesPanel } from "./WebhookDeliveriesPanel";
import { WebhookSubscriptionsPanel } from "./WebhookSubscriptionsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Wave 2 W2·E27 Integration Platform — docs/08-submodule-specifications/27-integration-platform/.
 * Outbound webhooks (this page) and the bank-file disbursement export
 * (on the Payroll run detail page) are the two concrete, real slices. ERP,
 * identity-provider, and biometric-device integrations stay deferred — no
 * real external system in this environment to connect to.
 */
export function IntegrationPlatformPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Integration platform administration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-ink-muted">Outbound webhooks for external systems.</p>
      </header>

      <WebhookSubscriptionsPanel />
      <WebhookDeliveriesPanel />
    </div>
  );
}
