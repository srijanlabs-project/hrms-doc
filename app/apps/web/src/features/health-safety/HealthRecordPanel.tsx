import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { createHealthRecord, listMyHealthRecords } from "../../lib/api/health-safety";

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-IN");
}

/** Self-service: log my own checkups, vaccinations, and occupational-health reviews. */
export function HealthRecordPanel() {
  const queryClient = useQueryClient();
  const records = useQuery({ queryKey: ["health-records-mine"], queryFn: listMyHealthRecords });

  const [type, setType] = useState<"MedicalCheckup" | "Vaccination" | "OccupationalHealthReview">("MedicalCheckup");
  const [recordDate, setRecordDate] = useState("");
  const [provider, setProvider] = useState("");
  const [notes, setNotes] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["health-records-mine"] });
  const createMutation = useMutation({
    mutationFn: () => createHealthRecord({ type, recordDate, provider: provider || undefined, notes: notes || undefined }),
    onSuccess: () => {
      setRecordDate("");
      setProvider("");
      setNotes("");
      invalidate();
    },
  });

  return (
    <Card title="My Health Records">
      {createMutation.error instanceof ApiError && (
        <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createMutation.error.message}</p>
      )}
      <form
        className="mb-4 flex flex-wrap items-end gap-2 border-b border-border pb-4"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <select value={type} onChange={(e) => setType(e.target.value as typeof type)} className="input">
          <option value="MedicalCheckup">Medical Checkup</option>
          <option value="Vaccination">Vaccination</option>
          <option value="OccupationalHealthReview">Occupational Health Review</option>
        </select>
        <input required type="date" value={recordDate} onChange={(e) => setRecordDate(e.target.value)} className="input" />
        <input placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="input" />
        <input placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="input" />
        <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover">
          Log Record
        </button>
      </form>

      <ul className="space-y-2">
        {records.data?.map((r) => (
          <li key={r.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>
                <Badge tone="info">{r.type}</Badge> {r.provider && <span className="text-ink-faint">{r.provider}</span>}
              </span>
              <span className="text-xs text-ink-faint">{formatDate(r.recordDate)}</span>
            </div>
            {r.notes && <p className="mt-1 text-xs text-ink-faint">{r.notes}</p>}
            {r.nextDueDate && <p className="mt-1 text-xs text-ink-muted">Next due: {formatDate(r.nextDueDate)}</p>}
          </li>
        ))}
        {records.data?.length === 0 && <p className="text-sm text-ink-faint">No health records logged yet.</p>}
      </ul>
    </Card>
  );
}
