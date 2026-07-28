import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { listDepartments } from "../../lib/api/departments";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { createCriticalRole, getWorkforcePlanningView, runSuccessionCoverageCheckNow } from "../../lib/api/talent";
import { CriticalRoleRow } from "./CriticalRoleRow";

const ADMIN_ROLES = ["org_admin", "hr_ops"];
const CRITICALITY_TIERS = ["High", "Medium", "Low"] as const;

/**
 * Succession Planning — docs/08-submodule-specifications/13-talent-management/01-succession-planning.md.
 * Confidential per the spec: org_admin/hr_ops only, no employee self-service
 * view of successor status. v1 collapses review cycles/slates/calibration
 * into direct critical-role + successor rows; no risk indicators (no
 * flight/retirement-risk data source exists in this build).
 */
export function SuccessionPlanningPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  const roles = useQuery({ queryKey: ["critical-roles"], queryFn: getWorkforcePlanningView, enabled: isAdmin });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees, enabled: isAdmin });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments, enabled: isAdmin });

  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [incumbentEmployeeId, setIncumbentEmployeeId] = useState("");
  const [criticalityTier, setCriticalityTier] = useState<(typeof CRITICALITY_TIERS)[number]>("Medium");

  const create = useMutation({
    mutationFn: () =>
      createCriticalRole({
        title,
        departmentId: departmentId || undefined,
        incumbentEmployeeId: incumbentEmployeeId || undefined,
        criticalityTier,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["critical-roles"] });
      setTitle("");
      setDepartmentId("");
      setIncumbentEmployeeId("");
      setCriticalityTier("Medium");
    },
  });
  const runNow = useMutation({ mutationFn: runSuccessionCoverageCheckNow });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Succession planning is confidential and restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  const atRiskCount = roles.data?.filter((r) => !r.hasReadyCoverage).length ?? 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Succession Planning</h1>
        <p className="text-ink-muted">
          Critical roles and their successor pipelines. {atRiskCount > 0 && `${atRiskCount} role(s) lack ready coverage.`}
        </p>
      </header>

      <Card
        title="Critical Roles"
        action={
          <button
            type="button"
            disabled={runNow.isPending}
            onClick={() => runNow.mutate()}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            {runNow.isPending ? "Checking…" : "Run Coverage Check Now"}
          </button>
        }
      >
        {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="mb-4 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Role Title</span>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Department</span>
            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input w-44">
              <option value="">None</option>
              {departments.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Incumbent</span>
            <select value={incumbentEmployeeId} onChange={(e) => setIncumbentEmployeeId(e.target.value)} className="input w-44">
              <option value="">None</option>
              {employees.data?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.legalName}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Criticality</span>
            <select value={criticalityTier} onChange={(e) => setCriticalityTier(e.target.value as typeof criticalityTier)} className="input">
              {CRITICALITY_TIERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {create.isPending ? "Adding…" : "Add Critical Role"}
          </button>
        </form>

        <ul className="space-y-3">
          {roles.data?.map((role) => (
            <CriticalRoleRow key={role.id} role={role} />
          ))}
          {roles.data?.length === 0 && <p className="text-ink-muted">No critical roles designated yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
