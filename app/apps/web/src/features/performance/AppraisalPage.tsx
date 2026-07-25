import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { createAppraisal, listMyAppraisals, listTeamAppraisals } from "../../lib/api/performance";
import { ManagerReviewForm } from "./ManagerReviewForm";
import { SelfReviewForm } from "./SelfReviewForm";
import { appraisalStatusTone } from "./status-tone";

const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** T-005 pattern -> self + manager appraisal review, per docs/08-submodule-specifications/11-performance-management/02-appraisals.md (v1: no skip-level, no calibration, no disputes). */
export function AppraisalPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));

  const myAppraisals = useQuery({ queryKey: ["appraisals-my"], queryFn: listMyAppraisals });
  const teamAppraisals = useQuery({ queryKey: ["appraisals-team"], queryFn: listTeamAppraisals });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees, enabled: isAdmin });

  const now = new Date();
  const [employeeId, setEmployeeId] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createAppraisal(employeeId, now.getUTCFullYear()),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["appraisals-team"] });
      setEmployeeId("");
    },
  });
  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Appraisals</h1>
        <p className="text-ink-muted">Complete your self-review and track manager feedback for {now.getUTCFullYear()}.</p>
      </header>

      {isAdmin && (
        <Card title="Open a New Appraisal">
          {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
          >
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
              <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input w-64">
                <option value="">Select employee</option>
                {employees.data?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.legalName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              {createMutation.isPending ? "Creating…" : "Open Appraisal"}
            </button>
          </form>
        </Card>
      )}

      <Card title="My Appraisals">
        {myAppraisals.data?.length === 0 && <p className="text-ink-muted">No appraisals opened for you yet.</p>}
        <ul className="space-y-3">
          {myAppraisals.data?.map((appraisal) => (
            <li key={appraisal.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{appraisal.periodYear} Appraisal</span>
                <Badge tone={appraisalStatusTone(appraisal.status)}>{appraisal.status}</Badge>
              </div>
              {appraisal.selfRating && (
                <p className="mt-1 text-xs text-ink-faint">
                  Self rating: {appraisal.selfRating}/5 — {appraisal.selfComments}
                </p>
              )}
              {appraisal.managerRating && (
                <p className="mt-1 text-xs text-ink-faint">
                  Manager rating: {appraisal.managerRating}/5 — {appraisal.managerComments}
                </p>
              )}
              {appraisal.calibratedRating != null && (
                <p className="mt-1 text-xs font-medium text-primary">Calibrated rating: {appraisal.calibratedRating}/5</p>
              )}
              {appraisal.status === "Draft" && <SelfReviewForm appraisalId={appraisal.id} />}
            </li>
          ))}
        </ul>
      </Card>

      {(teamAppraisals.data?.length ?? 0) > 0 && (
        <Card title="Team Appraisals">
          <ul className="space-y-3">
            {teamAppraisals.data?.map((appraisal) => (
              <li key={appraisal.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {appraisal.employee.legalName} — {appraisal.periodYear}
                  </span>
                  <Badge tone={appraisalStatusTone(appraisal.status)}>{appraisal.status}</Badge>
                </div>
                {appraisal.selfRating && (
                  <p className="mt-1 text-xs text-ink-faint">
                    Self rating: {appraisal.selfRating}/5 — {appraisal.selfComments}
                  </p>
                )}
                <ManagerReviewForm appraisal={appraisal} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
