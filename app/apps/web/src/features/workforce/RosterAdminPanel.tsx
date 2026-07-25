import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { listShifts, publishRoster, upsertRosterEntry } from "../../lib/api/workforce";

/** Admin-only: draft roster entries and publish a date range. org_admin/hr_ops. */
export function RosterAdminPanel() {
  const shifts = useQuery({ queryKey: ["shifts"], queryFn: listShifts });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [rosterEmployeeId, setRosterEmployeeId] = useState("");
  const [rosterShiftId, setRosterShiftId] = useState("");
  const [rosterDate, setRosterDate] = useState("");
  const [publishFrom, setPublishFrom] = useState("");
  const [publishTo, setPublishTo] = useState("");
  const [publishResult, setPublishResult] = useState<number | null>(null);

  const rosterMutation = useMutation({
    mutationFn: () => upsertRosterEntry({ employeeId: rosterEmployeeId, shiftId: rosterShiftId, date: rosterDate }),
    onSuccess: () => {
      setRosterEmployeeId("");
      setRosterDate("");
    },
  });

  const publishMutation = useMutation({
    mutationFn: () => publishRoster(publishFrom, publishTo),
    onSuccess: (result) => setPublishResult(result.publishedCount),
  });

  return (
    <Card title="Roster Planner">
      {rosterMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{rosterMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          rosterMutation.mutate();
        }}
      >
        <select required value={rosterEmployeeId} onChange={(e) => setRosterEmployeeId(e.target.value)} className="input">
          <option value="">Employee…</option>
          {employees.data?.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.legalName}
            </option>
          ))}
        </select>
        <select required value={rosterShiftId} onChange={(e) => setRosterShiftId(e.target.value)} className="input">
          <option value="">Shift…</option>
          {shifts.data?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.code} — {s.name}
            </option>
          ))}
        </select>
        <input required type="date" value={rosterDate} onChange={(e) => setRosterDate(e.target.value)} className="input" />
        <button type="submit" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-surface-hover">
          Save Draft Entry
        </button>
      </form>

      {publishMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{publishMutation.error.message}</p>
      )}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          publishMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Publish from</span>
          <input required type="date" value={publishFrom} onChange={(e) => setPublishFrom(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">to</span>
          <input required type="date" value={publishTo} onChange={(e) => setPublishTo(e.target.value)} className="input" />
        </label>
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Publish Range
        </button>
        {publishResult !== null && <span className="text-xs text-ink-faint">{publishResult} entries published.</span>}
      </form>
    </Card>
  );
}
