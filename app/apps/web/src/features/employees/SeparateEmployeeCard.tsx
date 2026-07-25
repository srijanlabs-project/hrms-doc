import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { separateEmployee } from "../../lib/api/employees";
import type { Employee } from "../../lib/api/types";

const EXIT_REASONS = ["Resignation", "Termination", "Retirement", "Other"];

/** Admin-only. v1 slice of docs/08-submodule-specifications/02-people-management/13-exit.md — see EmployeeService.separate. */
export function SeparateEmployeeCard({ employee }: { employee: Employee }) {
  const queryClient = useQueryClient();
  const [lastWorkingDay, setLastWorkingDay] = useState("");
  const [reason, setReason] = useState("Resignation");

  const mutation = useMutation({
    mutationFn: () => separateEmployee(employee.id, lastWorkingDay, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employees", employee.id] });
      setLastWorkingDay("");
    },
  });

  const errorMessage = mutation.error instanceof ApiError ? mutation.error.message : undefined;

  if (employee.status === "Separated") {
    return (
      <Card title="Exit">
        <p className="text-ink-muted">
          Separated{employee.lastWorkingDay && ` — last working day ${new Date(employee.lastWorkingDay).toLocaleDateString("en-IN")}`}
          {employee.exitReason && ` (${employee.exitReason})`}.
        </p>
      </Card>
    );
  }

  return (
    <Card title="Exit">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Last Working Day</span>
          <input
            required
            type="date"
            value={lastWorkingDay}
            onChange={(e) => setLastWorkingDay(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Reason</span>
          <select value={reason} onChange={(e) => setReason(e.target.value)} className="input">
            {EXIT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-negative px-4 py-2 font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {mutation.isPending ? "Marking Separated…" : "Mark as Separated"}
        </button>
      </form>
    </Card>
  );
}
