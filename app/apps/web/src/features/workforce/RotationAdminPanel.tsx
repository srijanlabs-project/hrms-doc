import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createRotationPattern, listRotationPatterns } from "../../lib/api/rotation";
import { listShifts } from "../../lib/api/workforce";
import { RotationAssignPanel } from "./RotationAssignPanel";

/**
 * Admin-only: shift rotation patterns (an ordered weekly cycle of shifts).
 * Closes Workforce Management's "shift rotation" gap. Assignment + roster
 * generation live in RotationAssignPanel.
 */
export function RotationAdminPanel() {
  const queryClient = useQueryClient();
  const patterns = useQuery({ queryKey: ["rotation-patterns"], queryFn: listRotationPatterns });
  const shifts = useQuery({ queryKey: ["shifts"], queryFn: listShifts });

  const [name, setName] = useState("");
  const [shiftIds, setShiftIds] = useState<string[]>(["", ""]);

  const createMutation = useMutation({
    mutationFn: () => createRotationPattern({ name, shiftIds: shiftIds.filter(Boolean) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rotation-patterns"] });
      setName("");
      setShiftIds(["", ""]);
    },
  });

  return (
    <div className="space-y-4">
      <Card title="Shift Rotation Patterns">
        {createMutation.error instanceof ApiError && (
          <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
        )}
        <form
          className="mb-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate();
          }}
        >
          <input required placeholder="Pattern name" value={name} onChange={(e) => setName(e.target.value)} className="input w-40" />
          {shiftIds.map((value, index) => (
            <select
              key={index}
              required
              value={value}
              onChange={(e) => setShiftIds((prev) => prev.map((v, i) => (i === index ? e.target.value : v)))}
              className="input"
            >
              <option value="">{`Week ${index}…`}</option>
              {shifts.data?.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} — {s.name}
                </option>
              ))}
            </select>
          ))}
          <button
            type="button"
            onClick={() => setShiftIds((prev) => [...prev, ""])}
            className="rounded-lg border border-border px-3 py-2 text-xs font-semibold hover:bg-surface-hover"
          >
            + Week
          </button>
          <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
            Create Pattern
          </button>
        </form>
        <ul className="space-y-1">
          {patterns.data?.map((p) => (
            <li key={p.id} className="rounded-lg border border-border p-2 text-sm">
              {p.name} · {p.cadenceWeeks}-week cycle: {p.steps.map((s) => s.shift.code).join(" → ")}
            </li>
          ))}
          {patterns.data?.length === 0 && <p className="text-sm text-ink-faint">No rotation patterns yet.</p>}
        </ul>
      </Card>

      <RotationAssignPanel patterns={patterns.data} />
    </div>
  );
}
