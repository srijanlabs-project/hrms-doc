import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listDesignations } from "../../lib/api/org-settings";
import { ApiError } from "../../lib/api/http";
import { addCareerPlanAction, completeCareerPlanAction, createMyCareerPlan, listMyCareerPlans, updateCareerPlanStatus } from "../../lib/api/talent";
import type { CareerPlan } from "../../lib/api/types";

const STATUSES = ["Active", "Achieved", "Cancelled"] as const;

function statusTone(status: string) {
  if (status === "Achieved") return "positive" as const;
  if (status === "Cancelled") return "negative" as const;
  if (status === "Active") return "info" as const;
  return "neutral" as const;
}

function PlanCard({ plan }: { plan: CareerPlan }) {
  const queryClient = useQueryClient();
  const [actionTitle, setActionTitle] = useState("");
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["career-plans", "mine"] });

  const addAction = useMutation({
    mutationFn: () => addCareerPlanAction(plan.id, actionTitle),
    onSuccess: () => {
      invalidate();
      setActionTitle("");
    },
  });
  const completeAction = useMutation({ mutationFn: (actionId: string) => completeCareerPlanAction(actionId), onSuccess: invalidate });
  const setStatus = useMutation({ mutationFn: (status: string) => updateCareerPlanStatus(plan.id, status), onSuccess: invalidate });

  const canChangeStatus = plan.status === "Draft" || plan.status === "Active";

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          {plan.targetDesignation && <span className="font-medium">Target: {plan.targetDesignation.title}</span>}
          {plan.timeframeYears && <span className="text-xs text-ink-faint"> · {plan.timeframeYears}yr timeframe</span>}
        </div>
        <Badge tone={statusTone(plan.status)}>{plan.status}</Badge>
      </div>
      <p className="mt-1 text-xs text-ink-faint">{plan.developmentNotes}</p>

      <ul className="mt-2 space-y-1">
        {plan.actions.map((a) => (
          <li key={a.id} className="flex items-center gap-2 text-xs">
            <Badge tone={a.status === "Completed" ? "positive" : "neutral"}>{a.status === "Completed" ? "Done" : "Pending"}</Badge>
            <span className={a.status === "Completed" ? "text-ink-faint line-through" : ""}>{a.title}</span>
            {a.status !== "Completed" && (
              <button type="button" onClick={() => completeAction.mutate(a.id)} className="text-primary hover:underline">
                Mark done
              </button>
            )}
          </li>
        ))}
      </ul>

      <form
        className="mt-2 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addAction.mutate();
        }}
      >
        <input
          required
          placeholder="Add a development action"
          value={actionTitle}
          onChange={(e) => setActionTitle(e.target.value)}
          className="input flex-1 basis-40 text-xs"
        />
        <button type="submit" disabled={addAction.isPending} className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary">
          Add
        </button>
      </form>

      {canChangeStatus && (
        <div className="mt-2 flex gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus.mutate(s)}
              className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </li>
  );
}

/** Wave 3 E13 gap closure ("career planning") — self-service by default: the employee creates and drives their own plan. */
export function CareerPlanSelfPanel() {
  const queryClient = useQueryClient();
  const plans = useQuery({ queryKey: ["career-plans", "mine"], queryFn: listMyCareerPlans });
  const designations = useQuery({ queryKey: ["designations"], queryFn: listDesignations });

  const [targetDesignationId, setTargetDesignationId] = useState("");
  const [timeframeYears, setTimeframeYears] = useState("");
  const [developmentNotes, setDevelopmentNotes] = useState("");

  const create = useMutation({
    mutationFn: () =>
      createMyCareerPlan({
        targetDesignationId: targetDesignationId || undefined,
        timeframeYears: timeframeYears ? Number(timeframeYears) : undefined,
        developmentNotes,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["career-plans", "mine"] });
      setTargetDesignationId("");
      setTimeframeYears("");
      setDevelopmentNotes("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="Career Plan">
      <div className="space-y-4">
        {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <select value={targetDesignationId} onChange={(e) => setTargetDesignationId(e.target.value)} className="input">
            <option value="">Target designation (optional)</option>
            {designations.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="30"
            placeholder="Years"
            value={timeframeYears}
            onChange={(e) => setTimeframeYears(e.target.value)}
            className="input w-24"
          />
          <input
            required
            placeholder="What are you working toward, and why?"
            value={developmentNotes}
            onChange={(e) => setDevelopmentNotes(e.target.value)}
            className="input flex-1 basis-52"
          />
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Start a Plan
          </button>
        </form>

        <ul className="space-y-2">
          {plans.data?.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
          {plans.data?.length === 0 && <p className="text-xs text-ink-faint">No career plans yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
