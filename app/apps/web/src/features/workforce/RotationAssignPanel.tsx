import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { assignRotation, generateRosterFromRotation, type ShiftRotationPattern } from "../../lib/api/rotation";

/** Assign an employee to a rotation pattern, then materialize real RosterEntry rows for a date range. */
export function RotationAssignPanel({ patterns }: { patterns: ShiftRotationPattern[] | undefined }) {
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [assignEmployeeId, setAssignEmployeeId] = useState("");
  const [assignPatternId, setAssignPatternId] = useState("");
  const [anchorWeekStart, setAnchorWeekStart] = useState("");

  const [genEmployeeId, setGenEmployeeId] = useState("");
  const [genFrom, setGenFrom] = useState("");
  const [genTo, setGenTo] = useState("");

  const assignMutation = useMutation({
    mutationFn: () => assignRotation({ employeeId: assignEmployeeId, patternId: assignPatternId, anchorWeekStart }),
    onSuccess: () => {
      setAssignEmployeeId("");
      setAnchorWeekStart("");
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => generateRosterFromRotation({ employeeId: genEmployeeId, from: genFrom, to: genTo }),
  });

  return (
    <>
      <Card title="Assign Rotation">
        {assignMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{assignMutation.error.message}</p>
        )}
        <form
          className="flex flex-wrap items-end gap-2"
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
          <select required value={assignPatternId} onChange={(e) => setAssignPatternId(e.target.value)} className="input">
            <option value="">Pattern…</option>
            {patterns?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Anchor week (Monday)</span>
            <input required type="date" value={anchorWeekStart} onChange={(e) => setAnchorWeekStart(e.target.value)} className="input" />
          </label>
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Assign
          </button>
        </form>
        {assignMutation.isSuccess && <p className="mt-2 text-xs text-positive">Assigned.</p>}
      </Card>

      <Card title="Generate Roster From Rotation">
        {generateMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{generateMutation.error.message}</p>
        )}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            generateMutation.mutate();
          }}
        >
          <select required value={genEmployeeId} onChange={(e) => setGenEmployeeId(e.target.value)} className="input">
            <option value="">Employee…</option>
            {employees.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName}
              </option>
            ))}
          </select>
          <input required type="date" value={genFrom} onChange={(e) => setGenFrom(e.target.value)} className="input" />
          <input required type="date" value={genTo} onChange={(e) => setGenTo(e.target.value)} className="input" />
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Generate
          </button>
        </form>
        {generateMutation.data && (
          <p className="mt-2 text-xs text-positive">Generated {generateMutation.data.generatedCount} roster entr(y/ies).</p>
        )}
      </Card>
    </>
  );
}
