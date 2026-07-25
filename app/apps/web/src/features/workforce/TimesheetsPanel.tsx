import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  approveTimesheetEntry,
  createTimesheetEntry,
  listMyTimesheetEntries,
  listTeamTimesheetEntries,
  rejectTimesheetEntry,
  withdrawTimesheetEntry,
} from "../../lib/api/workforce";
import { workforceStatusTone } from "./status-tone";

/** 05-timesheets.md v1 slice — activity is free text, no project/client master data yet. */
export function TimesheetsPanel() {
  const queryClient = useQueryClient();
  const mine = useQuery({ queryKey: ["timesheets-mine"], queryFn: listMyTimesheetEntries });
  const team = useQuery({ queryKey: ["timesheets-team"], queryFn: listTeamTimesheetEntries });

  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [activity, setActivity] = useState("");

  const invalidateMine = () => queryClient.invalidateQueries({ queryKey: ["timesheets-mine"] });
  const invalidateTeam = () => queryClient.invalidateQueries({ queryKey: ["timesheets-team"] });

  const createMutation = useMutation({
    mutationFn: () => createTimesheetEntry({ date, hours: Number(hours), activity }),
    onSuccess: () => {
      invalidateMine();
      setDate("");
      setHours("");
      setActivity("");
    },
  });
  const withdrawMutation = useMutation({ mutationFn: (id: string) => withdrawTimesheetEntry(id), onSuccess: invalidateMine });
  const approveMutation = useMutation({ mutationFn: (id: string) => approveTimesheetEntry(id), onSuccess: invalidateTeam });
  const rejectMutation = useMutation({ mutationFn: (id: string) => rejectTimesheetEntry(id), onSuccess: invalidateTeam });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <div className="space-y-4">
      <Card title="Log Time">
        {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Date</span>
            <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Hours</span>
            <input
              required
              type="number"
              min="0.5"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="input w-24"
            />
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Activity</span>
            <input required value={activity} onChange={(e) => setActivity(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            {createMutation.isPending ? "Submitting…" : "Submit"}
          </button>
        </form>
      </Card>

      <Card title="My Timesheet">
        <ul className="space-y-2">
          {mine.data?.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
              <span>
                {new Date(entry.date).toLocaleDateString("en-IN")} · {entry.hours}h · {entry.activity}{" "}
                <Badge tone={workforceStatusTone(entry.status)}>{entry.status}</Badge>
              </span>
              {entry.status === "Submitted" && (
                <button type="button" onClick={() => withdrawMutation.mutate(entry.id)} className="text-xs text-negative hover:underline">
                  Withdraw
                </button>
              )}
            </li>
          ))}
          {mine.data?.length === 0 && <p className="text-sm text-ink-faint">No timesheet entries yet.</p>}
        </ul>
      </Card>

      {(team.data?.length ?? 0) > 0 && (
        <Card title="Team Timesheets">
          <ul className="space-y-2">
            {team.data?.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <span>
                  {entry.employee.legalName} — {new Date(entry.date).toLocaleDateString("en-IN")} · {entry.hours}h ·{" "}
                  {entry.activity} <Badge tone={workforceStatusTone(entry.status)}>{entry.status}</Badge>
                </span>
                {entry.status === "Submitted" && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => approveMutation.mutate(entry.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectMutation.mutate(entry.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
