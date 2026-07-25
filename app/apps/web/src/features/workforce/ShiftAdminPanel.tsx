import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { assignShift, createShift, listAllShiftAssignments, listShifts } from "../../lib/api/workforce";

/** Admin-only: shift catalog + effective-dated standing assignment. org_admin/hr_ops. */
export function ShiftAdminPanel() {
  const queryClient = useQueryClient();
  const shifts = useQuery({ queryKey: ["shifts"], queryFn: listShifts });
  const assignments = useQuery({ queryKey: ["shift-assignments-all"], queryFn: listAllShiftAssignments });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [plannedMinutes, setPlannedMinutes] = useState("540");

  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignShiftId, setAssignShiftId] = useState("");
  const [effectiveFrom, setEffectiveFrom] = useState("");

  const createShiftMutation = useMutation({
    mutationFn: () => createShift({ code, name, startTime, endTime, plannedMinutes: Number(plannedMinutes) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
      setCode("");
      setName("");
    },
  });

  const assignMutation = useMutation({
    mutationFn: () => assignShift({ employeeId: assignEmployeeId, shiftId: assignShiftId, effectiveFrom }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shift-assignments-all"] });
      setAssignEmployeeId("");
      setEffectiveFrom("");
    },
  });

  return (
    <div className="space-y-4">
      <Card title="Shift Catalog">
        {createShiftMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createShiftMutation.error.message}</p>
        )}
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createShiftMutation.mutate();
          }}
        >
          <input required placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} className="input w-24" />
          <input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="input w-40" />
          <input required type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input" />
          <input required type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input" />
          <input
            required
            type="number"
            min="1"
            placeholder="Planned mins"
            value={plannedMinutes}
            onChange={(e) => setPlannedMinutes(e.target.value)}
            className="input w-28"
          />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Add Shift
          </button>
        </form>
        <ul className="space-y-1">
          {shifts.data?.map((s) => (
            <li key={s.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-mono text-xs text-ink-faint">{s.code}</span> {s.name} · {s.startTime}–{s.endTime}
              {s.crossMidnight && " (overnight)"} · {s.plannedMinutes}min planned, {s.graceMinutes}min grace
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Assign Standing Shift">
        {assignMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{assignMutation.error.message}</p>
        )}
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            assignMutation.mutate();
          }}
        >
          <select required value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} className="input">
            <option value="">Employee…</option>
            {employees.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName}
              </option>
            ))}
          </select>
          <select required value={assignShiftId} onChange={(e) => setAssignShiftId(e.target.value)} className="input">
            <option value="">Shift…</option>
            {shifts.data?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} — {s.name}
              </option>
            ))}
          </select>
          <input required type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Assign
          </button>
        </form>
        <ul className="space-y-1">
          {assignments.data?.map((a) => (
            <li key={a.id} className="rounded-lg border border-border p-2 text-sm">
              {a.employee.legalName} — {a.shift.name} since {new Date(a.effectiveFrom).toLocaleDateString("en-IN")}
            </li>
          ))}
          {assignments.data?.length === 0 && <p className="text-sm text-ink-faint">No standing assignments yet.</p>}
        </ul>
      </Card>
    </div>
  );
}
