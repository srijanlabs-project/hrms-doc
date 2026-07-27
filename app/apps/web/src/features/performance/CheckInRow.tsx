import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import type { CheckIn } from "../../lib/api/types";
import { checkInStatusTone } from "./status-tone";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN");
}

/** One check-in row with note-adding and manager-only complete/cancel — extracted from CheckInsPage to keep it under the line limit. */
export function CheckInRow({
  checkIn,
  isManager,
  onSaveNotes,
  onComplete,
  onCancel,
}: {
  checkIn: CheckIn;
  isManager: boolean;
  onSaveNotes: (notes: string) => void;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [notes, setNotes] = useState("");

  return (
    <li className="rounded-lg border border-border p-3 text-sm">
      <div className="flex items-center justify-between">
        <span>
          {checkIn.employee.legalName} ↔ {checkIn.manager.legalName}{" "}
          <Badge tone={checkInStatusTone(checkIn.status)}>{checkIn.status}</Badge>
        </span>
        <span className="text-xs text-ink-faint">{formatDate(checkIn.scheduledDate)}</span>
      </div>
      {checkIn.agenda && <p className="mt-1 text-xs text-ink-faint">Agenda: {checkIn.agenda}</p>}
      {checkIn.managerNotes && <p className="mt-1 text-xs italic text-ink-muted">Manager notes: {checkIn.managerNotes}</p>}
      {checkIn.employeeNotes && <p className="mt-1 text-xs italic text-ink-muted">Employee notes: {checkIn.employeeNotes}</p>}

      {checkIn.status === "Scheduled" && (
        <div className="mt-2 flex items-end gap-2">
          <input
            placeholder={isManager ? "Manager notes" : "Employee notes"}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input w-56"
          />
          <button
            type="button"
            disabled={!notes}
            onClick={() => onSaveNotes(notes)}
            className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover disabled:opacity-50"
          >
            Save Notes
          </button>
          {isManager && (
            <>
              <button
                type="button"
                onClick={onComplete}
                className="rounded-lg bg-primary px-2 py-1 text-xs font-semibold text-white hover:bg-primary-hover"
              >
                Complete
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-border px-2 py-1 text-xs font-semibold hover:bg-surface-hover"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    </li>
  );
}
