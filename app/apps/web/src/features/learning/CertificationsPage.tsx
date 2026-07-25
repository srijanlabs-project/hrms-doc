import { useAuth } from "../auth/AuthProvider";
import { CertificationAdminPanel } from "./CertificationAdminPanel";
import { MyCertificationsPanel } from "./MyCertificationsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Certifications — docs/08-submodule-specifications/12-learning-and-development/02-certifications.md.
 * v1: no role-eligibility rule engine or equivalency mappings — a record
 * starts Active immediately and verification is an after-the-fact admin
 * confirmation, not a usage gate.
 */
export function CertificationsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Certifications</h1>
        <p className="text-ink-muted">Track professional and regulatory certifications and their expiry.</p>
      </header>

      <MyCertificationsPanel />
      {isAdmin && <CertificationAdminPanel />}
    </div>
  );
}
