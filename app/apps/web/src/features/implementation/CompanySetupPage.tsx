import { useQuery } from "@tanstack/react-query";
import { KpiCard } from "../../components/ui/KpiCard";
import { getSetupStatus } from "../../lib/api/company-setup";
import { useAuth } from "../auth/AuthProvider";
import { CompanySetupStep } from "./CompanySetupStep";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/**
 * Staged company setup — the onboarding/migration path for standing up a whole
 * company without hand-resolving UUIDs. Each step is gated on the one before
 * it: structure must exist before employees can reference a department by
 * code, and every employee must exist before a reporting line has two ends to
 * connect. That ordering is what stops a migration silently dropping data.
 *
 * Same flow serves both directions the user cares about — a brand-new company
 * (start at Step 1 with an empty tenant) and an existing company being
 * migrated (each step re-runnable, duplicates reported rather than
 * overwritten, so a partial load can be topped up).
 */
export function CompanySetupPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const status = useQuery({ queryKey: ["company-setup-status"], queryFn: getSetupStatus, enabled: isAdmin });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Company Setup is restricted to HR Operations and Company Org Admin roles.
      </div>
    );
  }

  const s = status.data;
  const structureReady = !!s && s.departments > 0;
  const employeesReady = !!s && s.employees > 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Company Setup</h1>
        <p className="text-ink-muted">
          Stand up a new company, or migrate an existing one, in four validated steps. Each step is uploaded as JSON
          and references the previous step by code — departments, designations and employees are linked for you, so
          there are no IDs to look up by hand.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Departments" value={s ? String(s.departments) : "—"} caption="Structure loaded" />
        <KpiCard label="Employees" value={s ? String(s.employees) : "—"} caption="Records created" />
        <KpiCard
          label="Reporting lines"
          value={s ? `${s.withManager}/${s.employees}` : "—"}
          caption="Have a manager"
        />
        <KpiCard label="Salary set" value={s ? `${s.withSalary}/${s.employees}` : "—"} caption="Compensation records" />
      </div>

      <CompanySetupStep
        stepNumber={1}
        stepKey="structure"
        title="Company Structure"
        description="Departments (use parentCode for hierarchy), designations and grades. Load this first — everything after refers to these by code."
        progress={s ? `${s.departments} dept · ${s.designations} desig · ${s.grades} grade` : "—"}
        locked={false}
      />

      <CompanySetupStep
        stepNumber={2}
        stepKey="employees"
        title="Employee Details"
        description="The roster. Link each person to structure with departmentCode / designationCode / gradeCode. Managers come next, so reporting lines aren't needed here."
        progress={s ? `${s.employees} employee(s)` : "—"}
        locked={!structureReady}
        lockedReason="Complete Step 1 first — employees reference departments by code, so the structure has to exist before this step can resolve anything."
      />

      <CompanySetupStep
        stepNumber={3}
        stepKey="managers"
        title="Manager Mapping"
        description="Reporting lines, applied once the whole roster exists so both ends of every edge resolve. Re-runnable — remap freely."
        progress={s ? `${s.withManager} of ${s.employees} mapped` : "—"}
        locked={!employeesReady}
        lockedReason="Complete Step 2 first — a reporting line needs both the employee and their manager to already exist."
      />

      <CompanySetupStep
        stepNumber={4}
        stepKey="salary"
        title="Salary & Other Details"
        description="Monthly basic per employee, with an effective-from date. Re-running updates the existing record rather than duplicating it. Leave needs nothing per-employee — a company-wide leave policy covers the whole roster and balances compute live."
        progress={s ? `${s.withSalary} of ${s.employees} set` : "—"}
        locked={!employeesReady}
        lockedReason="Complete Step 2 first — salary attaches to an existing employee record."
      />
    </div>
  );
}
