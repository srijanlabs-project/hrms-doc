import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { ApiError } from "../../lib/api/http";
import { createReportingLine, endReportingLine, listReportingLines } from "../../lib/api/org-settings";

const LINE_TYPES = ["Dotted", "Matrix", "Acting"];

/** Supplementary reporting lines (dotted/matrix/acting) — Employee.managerId remains the primary line used everywhere else. */
export function ReportingLineSection() {
  const queryClient = useQueryClient();
  const lines = useQuery({ queryKey: ["reporting-lines"], queryFn: listReportingLines });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [managerId, setManagerId] = useState("");
  const [lineType, setLineType] = useState("Dotted");
  const [startDate, setStartDate] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["reporting-lines"] });

  const createMutation = useMutation({
    mutationFn: () => createReportingLine({ employeeId, managerId, lineType, startDate }),
    onSuccess: () => {
      invalidate();
      setEmployeeId("");
      setManagerId("");
      setStartDate("");
    },
  });

  const endMutation = useMutation({ mutationFn: (id: string) => endReportingLine(id), onSuccess: invalidate });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Reporting Lines (Dotted / Matrix / Acting)">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
          <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
            <option value="">Select</option>
            {employees.data?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legalName}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Manager</span>
          <select required value={managerId} onChange={(e) => setManagerId(e.target.value)} className="input">
            <option value="">Select</option>
            {employees.data?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.legalName}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={lineType} onChange={(e) => setLineType(e.target.value)} className="input w-32">
            {LINE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Start Date</span>
          <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Line"}
        </button>
      </form>
      <ul className="space-y-2">
        {lines.data?.map((l) => (
          <li key={l.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
            <div>
              <span className="font-medium">{l.employee.legalName}</span> → {l.manager.legalName}{" "}
              <Badge tone={l.status === "Active" ? "info" : "neutral"}>
                {l.lineType} · {l.status}
              </Badge>
            </div>
            {l.status === "Active" && (
              <button
                type="button"
                onClick={() => endMutation.mutate(l.id)}
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
              >
                End
              </button>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
