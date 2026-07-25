import { useAuth } from "../auth/AuthProvider";
import { BenefitsAdminPanel } from "./BenefitsAdminPanel";
import { MyBenefitsPanel } from "./MyBenefitsPanel";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Benefits — docs/08-submodule-specifications/14-compensation-and-benefits/{04-benefits-administration,05-flexible-benefits}.md.
 * v1: no dependents, life events, vendor batches, or proof/reimbursement
 * tracking. Enrolling creates a real PayComponent assignment (reusing the
 * Payroll engine from E09), so elections genuinely affect the next payroll run.
 */
export function BenefitsPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Benefits</h1>
        <p className="text-ink-muted">Enroll in employer-sponsored plans and allocate your flex basket.</p>
      </header>

      <MyBenefitsPanel />
      {isAdmin && <BenefitsAdminPanel />}
    </div>
  );
}
