import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { addCareerPlanAction, completeCareerPlanAction, listAllCareerPlans, listTeamCareerPlans } from "../../lib/api/talent";
import type { CareerPlan } from "../../lib/api/types";

function statusTone(status: string) {
  if (status === "Achieved") return "positive" as const;
  if (status === "Cancelled") return "negative" as const;
  if (status === "Active") return "info" as const;
  return "neutral" as const;
}

function PlanRow({ plan, onAddAction, onCompleteAction }: { plan: CareerPlan; onAddAction: (planId: string, title: string) => void; onCompleteAction: (actionId: string) => void }) {
  const [actionTitle, setActionTitle] = useState("");

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{plan.employee.legalName}</span>
        <Badge tone={statusTone(plan.status)}>{plan.status}</Badge>
      </div>
      {plan.targetDesignation && <p className="mt-1 text-xs text-ink-faint">Target: {plan.targetDesignation.title}</p>}
      <p className="mt-1 text-xs text-ink-faint">{plan.developmentNotes}</p>
      <ul className="mt-2 space-y-1">
        {plan.actions.map((a) => (
          <li key={a.id} className="flex items-center gap-2 text-xs">
            <Badge tone={a.status === "Completed" ? "positive" : "neutral"}>{a.status === "Completed" ? "Done" : "Pending"}</Badge>
            <span className={a.status === "Completed" ? "text-ink-faint line-through" : ""}>{a.title}</span>
            {a.status !== "Completed" && (
              <button type="button" onClick={() => onCompleteAction(a.id)} className="text-primary hover:underline">
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
          onAddAction(plan.id, actionTitle);
          setActionTitle("");
        }}
      >
        <input
          required
          placeholder="Suggest a development action"
          value={actionTitle}
          onChange={(e) => setActionTitle(e.target.value)}
          className="input flex-1 basis-40 text-xs"
        />
        <button type="submit" className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary">
          Add
        </button>
      </form>
    </li>
  );
}

/** Manager/admin read view of career plans — supporting actions only, not creation (the employee owns that). */
export function CareerPlanTeamPanel({ isAdmin }: { isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const team = useQuery({ queryKey: ["career-plans", "team"], queryFn: listTeamCareerPlans, enabled: !isAdmin });
  const all = useQuery({ queryKey: ["career-plans", "all"], queryFn: listAllCareerPlans, enabled: isAdmin });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["career-plans", "team"] });
    void queryClient.invalidateQueries({ queryKey: ["career-plans", "all"] });
  };
  const addAction = useMutation({ mutationFn: ({ planId, title }: { planId: string; title: string }) => addCareerPlanAction(planId, title), onSuccess: invalidate });
  const completeAction = useMutation({ mutationFn: (actionId: string) => completeCareerPlanAction(actionId), onSuccess: invalidate });

  const plans = isAdmin ? all.data : team.data;

  return (
    <Card title="Career Plans">
      <ul className="space-y-2">
        {plans?.map((plan) => (
          <PlanRow
            key={plan.id}
            plan={plan}
            onAddAction={(planId, title) => addAction.mutate({ planId, title })}
            onCompleteAction={(actionId) => completeAction.mutate(actionId)}
          />
        ))}
        {plans?.length === 0 && <p className="text-sm text-ink-faint">No career plans yet.</p>}
      </ul>
    </Card>
  );
}
