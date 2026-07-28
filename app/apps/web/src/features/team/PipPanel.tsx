import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { closePip, completePipObjective, createPip, listAllPips, listTeamPips } from "../../lib/api/performance";
import type { PerformanceImprovementPlan } from "../../lib/api/types";
import type { TeamRosterMember } from "../../lib/api/team-dashboard";

const OUTCOMES = ["Completed", "Extended", "Failed"] as const;

function statusTone(status: string) {
  if (status === "Completed") return "positive" as const;
  if (status === "Failed") return "negative" as const;
  if (status === "Extended") return "warning" as const;
  return "info" as const;
}

function PipRow({ pip, onComplete, onClose }: { pip: PerformanceImprovementPlan; onComplete: (objectiveId: string) => void; onClose: (id: string, outcome: string) => void }) {
  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <span className="font-medium">{pip.employee.legalName}</span> <Badge tone={statusTone(pip.status)}>{pip.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            {new Date(pip.startDate).toLocaleDateString("en-IN")} – {new Date(pip.endDate).toLocaleDateString("en-IN")} · {pip.reason}
          </p>
          {pip.outcomeNotes && <p className="mt-1 text-xs text-ink-faint">Outcome: {pip.outcomeNotes}</p>}
        </div>
        {pip.status === "Active" && (
          <div className="flex shrink-0 gap-2">
            {OUTCOMES.map((outcome) => (
              <button
                key={outcome}
                type="button"
                onClick={() => onClose(pip.id, outcome)}
                className="rounded-lg border border-border px-2 py-1 text-xs font-medium hover:border-primary"
              >
                {outcome}
              </button>
            ))}
          </div>
        )}
      </div>
      <ul className="mt-2 space-y-1">
        {pip.objectives.map((o) => (
          <li key={o.id} className="flex items-center gap-2 text-xs">
            <Badge tone={o.status === "Completed" ? "positive" : "neutral"}>{o.status === "Completed" ? "Done" : "Pending"}</Badge>
            <span className={o.status === "Completed" ? "line-through text-ink-faint" : ""}>{o.title}</span>
            {o.status !== "Completed" && pip.status === "Active" && (
              <button type="button" onClick={() => onComplete(o.id)} className="text-primary hover:underline">
                Mark done
              </button>
            )}
          </li>
        ))}
      </ul>
    </li>
  );
}

/** W3·E11 gap closure — Performance Improvement Plans, rendered on the Team Dashboard alongside Transfers & Promotions. */
export function PipPanel({ roster, isAdmin }: { roster: TeamRosterMember[]; isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const team = useQuery({ queryKey: ["pips", "team"], queryFn: listTeamPips, enabled: !isAdmin });
  const all = useQuery({ queryKey: ["pips", "all"], queryFn: listAllPips, enabled: isAdmin });

  const [employeeId, setEmployeeId] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [objectivesInput, setObjectivesInput] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["pips"] });

  const createMutation = useMutation({
    mutationFn: () =>
      createPip({
        employeeId,
        reason,
        startDate,
        endDate,
        objectives: objectivesInput
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean),
      }),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setReason("");
      setStartDate("");
      setEndDate("");
      setObjectivesInput("");
    },
  });

  const completeMutation = useMutation({ mutationFn: (objectiveId: string) => completePipObjective(objectiveId), onSuccess: invalidate });
  const closeMutation = useMutation({ mutationFn: ({ id, outcome }: { id: string; outcome: string }) => closePip(id, outcome), onSuccess: invalidate });

  const errorMessage =
    createMutation.error instanceof ApiError
      ? createMutation.error.message
      : closeMutation.error instanceof ApiError
        ? closeMutation.error.message
        : undefined;

  const plans = isAdmin ? all.data : team.data;

  return (
    <Card title="Performance Improvement Plans">
      <div className="space-y-4">
        {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        {roster.length > 0 && (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
          >
            <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
              <option value="">Direct report…</option>
              {roster.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.legalName}
                </option>
              ))}
            </select>
            <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
            <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input" />
            <input required placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
            <input
              required
              placeholder="Objectives (comma-separated)"
              value={objectivesInput}
              onChange={(e) => setObjectivesInput(e.target.value)}
              className="input flex-1 basis-48"
            />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Create
            </button>
          </form>
        )}

        <ul className="space-y-2">
          {plans?.map((p) => (
            <PipRow
              key={p.id}
              pip={p}
              onComplete={(objectiveId) => completeMutation.mutate(objectiveId)}
              onClose={(id, outcome) => closeMutation.mutate({ id, outcome })}
            />
          ))}
          {plans?.length === 0 && <p className="text-sm text-ink-faint">No performance improvement plans yet.</p>}
        </ul>
      </div>
    </Card>
  );
}
