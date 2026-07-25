import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import {
  approveRosterSwap,
  listMyRosterSwaps,
  listTeamRosterSwaps,
  rejectRosterSwap,
  withdrawRosterSwap,
} from "../../lib/api/workforce";
import { workforceStatusTone } from "./status-tone";

/** Swap approval for a manager's direct reports — see RosterService.decideSwap (assigned-manager-or-admin). */
export function RosterSwapsPanel() {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["roster-swaps-mine"], queryFn: listMyRosterSwaps });
  const team = useQuery({ queryKey: ["roster-swaps-team"], queryFn: listTeamRosterSwaps });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["roster-swaps-mine"] });
    queryClient.invalidateQueries({ queryKey: ["roster-swaps-team"] });
    queryClient.invalidateQueries({ queryKey: ["my-roster"] });
  };

  const approveMutation = useMutation({ mutationFn: (id: string) => approveRosterSwap(id), onSuccess: invalidateAll });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectRosterSwap(id), onSuccess: invalidateAll });
  const withdrawMutation = useMutation({ mutationFn: (id: string) => withdrawRosterSwap(id), onSuccess: invalidateAll });

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="My Swap Requests">
        <ul className="space-y-2">
          {mine.data?.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span>
                  {s.reason || "Shift swap"} <Badge tone={workforceStatusTone(s.status)}>{s.status}</Badge>
                </span>
                {s.status === "Pending" && (
                  <button
                    type="button"
                    onClick={() => withdrawMutation.mutate(s.id)}
                    className="text-xs text-negative hover:underline"
                  >
                    Withdraw
                  </button>
                )}
              </div>
              {s.decisionNote && <p className="mt-1 text-xs text-ink-faint">Note: {s.decisionNote}</p>}
            </li>
          ))}
          {mine.data?.length === 0 && <p className="text-sm text-ink-faint">No swap requests.</p>}
        </ul>
      </Card>

      <Card title="Team Swap Requests">
        <ul className="space-y-2">
          {team.data?.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span>{s.reason || "Shift swap"}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => approveMutation.mutate(s.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectMutation.mutate(s.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
          {team.data?.length === 0 && <p className="text-sm text-ink-faint">Nothing pending your approval.</p>}
        </ul>
      </Card>
    </div>
  );
}
