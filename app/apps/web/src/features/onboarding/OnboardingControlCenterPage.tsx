import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { activateOnboardingCase, listOnboardingCases, waiveOnboardingTask } from "../../lib/api/onboarding";
import { onboardingCaseStatusTone, onboardingTaskStatusTone } from "./status-tone";

const ONBOARDING_ADMIN_ROLES = ["org_admin", "hr_ops"];

/** HR onboarding control center — blocker-focused readiness view across every case, per docs/08-.../09-onboarding.md §6 UX expectations. */
export function OnboardingControlCenterPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isAdmin = ONBOARDING_ADMIN_ROLES.some((role) => user?.roles.includes(role));

  const cases = useQuery({ queryKey: ["onboarding-cases"], queryFn: listOnboardingCases, enabled: isAdmin });
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["onboarding-cases"] });

  const activateMutation = useMutation({ mutationFn: activateOnboardingCase, onSuccess: invalidate });
  const waiveMutation = useMutation({ mutationFn: waiveOnboardingTask, onSuccess: invalidate });

  if (!isAdmin) {
    return (
      <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
        Onboarding administration is restricted to HR Operations and Org Admin roles.
      </div>
    );
  }

  const selected = cases.data?.find((c) => c.id === selectedId) ?? cases.data?.[0] ?? null;
  const error = activateMutation.error ?? waiveMutation.error;
  const errorMessage = error instanceof ApiError ? error.message : undefined;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Onboarding Control Center</h1>
        <p className="text-ink-muted">Track every new joiner's readiness and clear blockers.</p>
      </header>

      {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}

      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          {cases.isLoading && <p className="text-ink-muted">Loading cases…</p>}
          {cases.data?.length === 0 && (
            <div className="rounded-(--radius-card) border border-border bg-surface p-8 text-center text-ink-muted">
              No onboarding cases yet.
            </div>
          )}
          {cases.data?.map((c) => {
            const remaining = c.tasks.filter((t) => t.isBlocking && t.status === "NotStarted").length;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full items-center justify-between rounded-(--radius-card) border p-4 text-left ${
                  selected?.id === c.id ? "border-primary bg-primary-soft" : "border-border bg-surface"
                }`}
              >
                <div>
                  <div className="font-medium">{c.employee.legalName}</div>
                  <div className="text-xs text-ink-faint">
                    {c.employee.employeeCode} · {remaining > 0 ? `${remaining} blocker(s)` : "Ready"}
                  </div>
                </div>
                <Badge tone={onboardingCaseStatusTone(c.status)}>{c.status}</Badge>
              </button>
            );
          })}
        </div>

        {selected && (
          <Card
            title={`${selected.employee.legalName}'s Checklist`}
            action={
              selected.status !== "Activated" && (
                <button
                  type="button"
                  disabled={activateMutation.isPending}
                  onClick={() => activateMutation.mutate(selected.id)}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  Activate
                </button>
              )
            }
          >
            <ul className="w-80 space-y-2">
              {selected.tasks.map((task) => (
                <li key={task.id} className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">{task.title}</div>
                    {task.isBlocking && <div className="text-xs text-ink-faint">Blocking</div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={onboardingTaskStatusTone(task.status)}>{task.status}</Badge>
                    {task.status === "NotStarted" && (
                      <button
                        type="button"
                        disabled={waiveMutation.isPending}
                        onClick={() => waiveMutation.mutate(task.id)}
                        className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
                      >
                        Waive
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
