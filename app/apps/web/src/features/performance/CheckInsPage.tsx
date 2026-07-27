import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  addCheckInEmployeeNotes,
  addCheckInManagerNotes,
  cancelCheckIn,
  completeCheckIn,
  createCheckIn,
  listMyCheckIns,
} from "../../lib/api/performance";
import { getTeamDashboard } from "../../lib/api/team-dashboard";
import { useAuth } from "../auth/AuthProvider";
import { CheckInRow } from "./CheckInRow";

/**
 * Wave 3 W3·E11 Performance Management deepening — Check-ins / 1:1s
 * (docs/03-module-specifications/11-performance-management.md's check-ins
 * and 1:1-meetings catalog items, collapsed into one entity). Manager
 * schedules for a direct report; both sides can add their own notes.
 */
export function CheckInsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const checkIns = useQuery({ queryKey: ["check-ins-mine"], queryFn: listMyCheckIns });
  const team = useQuery({ queryKey: ["team-dashboard"], queryFn: getTeamDashboard });

  const [employeeId, setEmployeeId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [agenda, setAgenda] = useState("");

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["check-ins-mine"] });

  const createMutation = useMutation({
    mutationFn: () => createCheckIn({ employeeId, scheduledDate, agenda: agenda || undefined }),
    onSuccess: () => {
      setEmployeeId("");
      setScheduledDate("");
      setAgenda("");
      invalidate();
    },
  });
  const createError = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  const managerNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => addCheckInManagerNotes(id, notes),
    onSuccess: invalidate,
  });
  const employeeNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) => addCheckInEmployeeNotes(id, notes),
    onSuccess: invalidate,
  });
  const completeMutation = useMutation({ mutationFn: (id: string) => completeCheckIn(id), onSuccess: invalidate });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelCheckIn(id), onSuccess: invalidate });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Check-ins &amp; 1:1s</h1>
        <p className="text-ink-muted">Structured manager-employee conversations, scheduled and logged.</p>
      </header>

      {(team.data?.roster.length ?? 0) > 0 && (
        <Card title="Schedule a Check-in">
          {createError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createError}</p>}
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
            }}
          >
            <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
              <option value="">Select employee…</option>
              {team.data?.roster.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.legalName}
                </option>
              ))}
            </select>
            <input required type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="input" />
            <input placeholder="Agenda" value={agenda} onChange={(e) => setAgenda(e.target.value)} className="input flex-1" />
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
            >
              Schedule
            </button>
          </form>
        </Card>
      )}

      <Card title="My Check-ins">
        <ul className="space-y-2">
          {checkIns.data?.map((ci) => (
            <CheckInRow
              key={ci.id}
              checkIn={ci}
              isManager={ci.managerId === user?.employeeId}
              onSaveNotes={(notes) => {
                if (ci.managerId === user?.employeeId) managerNotesMutation.mutate({ id: ci.id, notes });
                else employeeNotesMutation.mutate({ id: ci.id, notes });
              }}
              onComplete={() => completeMutation.mutate(ci.id)}
              onCancel={() => cancelMutation.mutate(ci.id)}
            />
          ))}
          {checkIns.data?.length === 0 && <p className="text-sm text-ink-faint">No check-ins scheduled yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
