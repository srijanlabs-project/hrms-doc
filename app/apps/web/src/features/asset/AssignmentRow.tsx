import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import type { AssetAssignment } from "../../lib/api/types";
import { assignmentStatusTone } from "./status-tone";

const RETURN_CONDITIONS = ["Good", "Damaged", "Lost"];

export function AssignmentRow({
  assignment,
  showEmployee = false,
  onReturn,
}: {
  assignment: AssetAssignment;
  showEmployee?: boolean;
  onReturn?: (id: string, condition: string, notes?: string) => void;
}) {
  const [returning, setReturning] = useState(false);
  const [condition, setCondition] = useState("Good");
  const [notes, setNotes] = useState("");

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">
            {showEmployee ? `${assignment.employee.legalName} — ` : ""}
            {assignment.asset.category}: {assignment.asset.name}
          </span>{" "}
          <Badge tone={assignmentStatusTone(assignment.status)}>{assignment.status}</Badge>
          <p className="mt-1 text-xs text-ink-faint">
            Tag: {assignment.asset.assetTag} · Assigned {new Date(assignment.assignedAt).toLocaleDateString("en-IN")}
            {assignment.returnedAt &&
              ` · Returned ${new Date(assignment.returnedAt).toLocaleDateString("en-IN")} (${assignment.returnCondition})`}
          </p>
          {assignment.notes && <p className="mt-1 text-xs text-ink-faint">Note: {assignment.notes}</p>}
        </div>
        {assignment.status === "Assigned" && onReturn && !returning && (
          <button
            type="button"
            onClick={() => setReturning(true)}
            className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            Return
          </button>
        )}
      </div>
      {returning && (
        <form
          className="mt-3 flex flex-wrap items-end gap-2 border-t border-border pt-3"
          onSubmit={(e) => {
            e.preventDefault();
            onReturn?.(assignment.id, condition, notes || undefined);
            setReturning(false);
          }}
        >
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Condition</span>
            <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input w-32">
              {RETURN_CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1 basis-40">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            Confirm Return
          </button>
          <button
            type="button"
            onClick={() => setReturning(false)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
          >
            Cancel
          </button>
        </form>
      )}
    </li>
  );
}
