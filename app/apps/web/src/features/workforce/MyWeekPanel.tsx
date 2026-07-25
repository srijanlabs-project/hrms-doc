import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { getMyRoster, requestRosterSwap } from "../../lib/api/workforce";
import { useAuth } from "../auth/AuthProvider";
import { workforceStatusTone } from "./status-tone";

function nextDays(count: number): { from: string; to: string } {
  const today = new Date();
  const from = today.toISOString().slice(0, 10);
  const end = new Date(today);
  end.setDate(end.getDate() + count - 1);
  return { from, to: end.toISOString().slice(0, 10) };
}

/** Manager Self Service tie-in: My Week reads RosterEntry falling back to the standing ShiftAssignment. */
export function MyWeekPanel() {
  const { user } = useAuth();
  const { from, to } = nextDays(7);
  const queryClient = useQueryClient();

  const roster = useQuery({ queryKey: ["my-roster", from, to], queryFn: () => getMyRoster(from, to) });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [swapFor, setSwapFor] = useState<string | null>(null);
  const [counterpartId, setCounterpartId] = useState("");
  const [reason, setReason] = useState("");

  const swapMutation = useMutation({
    mutationFn: (entryId: string) => requestRosterSwap(entryId, { counterpartEmployeeId: counterpartId, reason: reason || undefined }),
    onSuccess: () => {
      setSwapFor(null);
      setCounterpartId("");
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["my-roster"] });
      queryClient.invalidateQueries({ queryKey: ["roster-swaps-mine"] });
    },
  });

  return (
    <Card title="My Week">
      <ul className="space-y-2">
        {roster.data?.map((day) => (
          <li key={day.date} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                </span>{" "}
                {day.shiftName ? (
                  <span className="text-sm text-ink-muted">{day.shiftName}</span>
                ) : (
                  <span className="text-sm text-ink-faint">No shift assigned</span>
                )}{" "}
                <Badge tone={workforceStatusTone(day.status)}>{day.status}</Badge>
                {day.source === "Default" && <Badge tone="neutral">Standing shift</Badge>}
              </div>
              {day.source === "Roster" && day.status === "Published" && day.entryId && (
                <button
                  type="button"
                  onClick={() => setSwapFor(swapFor === day.entryId ? null : day.entryId)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                >
                  Request Swap
                </button>
              )}
            </div>
            {day.entryId && swapFor === day.entryId && (
              <form
                className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (day.entryId) swapMutation.mutate(day.entryId);
                }}
              >
                <select value={counterpartId} onChange={(e) => setCounterpartId(e.target.value)} required className="input">
                  <option value="">Swap with…</option>
                  {employees.data
                    ?.filter((emp) => emp.id !== user?.employeeId)
                    .map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.legalName}
                      </option>
                    ))}
                </select>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (optional)"
                  className="input flex-1 basis-40"
                />
                <button
                  type="submit"
                  disabled={!counterpartId || swapMutation.isPending}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  Submit
                </button>
              </form>
            )}
          </li>
        ))}
        {roster.data?.length === 0 && <p className="text-sm text-ink-faint">No roster data.</p>}
      </ul>
      {swapMutation.error instanceof ApiError && (
        <p className="mt-2 rounded-lg bg-negative-soft px-3 py-2 text-sm text-negative">{swapMutation.error.message}</p>
      )}
    </Card>
  );
}
