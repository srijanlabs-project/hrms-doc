import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import type { Employee, GrievanceCase } from "../../lib/api/types";
import { grievanceStatusTone } from "./status-tone";

export function GrievanceAdminRow({
  grievanceCase,
  employees,
  onAssignHandler,
  onResolve,
  onClose,
}: {
  grievanceCase: GrievanceCase;
  employees?: Employee[];
  onAssignHandler: (id: string, handlerEmployeeId: string) => void;
  onResolve: (id: string, resolutionSummary: string) => void;
  onClose: (id: string) => void;
}) {
  const [handlerId, setHandlerId] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");

  return (
    <li className="rounded-lg border border-border p-3">
      <div className="mb-2 flex items-center justify-between">
        <span>
          <span className="font-medium">
            {grievanceCase.employee.legalName} — {grievanceCase.caseType}
          </span>{" "}
          <Badge tone={grievanceStatusTone(grievanceCase.status)}>{grievanceCase.status}</Badge>
        </span>
        {grievanceCase.assignedHandler && (
          <span className="text-xs text-ink-faint">Handler: {grievanceCase.assignedHandler.legalName}</span>
        )}
      </div>
      <p className="mb-1 text-xs text-ink-faint">{grievanceCase.subject}</p>
      <p className="mb-2 text-xs text-ink-faint">{grievanceCase.description}</p>
      {grievanceCase.resolutionSummary && (
        <p className="mb-2 text-xs text-ink-faint">Resolution: {grievanceCase.resolutionSummary}</p>
      )}

      {grievanceCase.status === "Received" && (
        <div className="flex flex-wrap items-end gap-2">
          <select value={handlerId} onChange={(e) => setHandlerId(e.target.value)} className="input w-56">
            <option value="">Assign handler…</option>
            {employees?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName} ({emp.employeeCode})
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!handlerId}
            onClick={() => onAssignHandler(grievanceCase.id, handlerId)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Assign
          </button>
        </div>
      )}

      {(grievanceCase.status === "Received" || grievanceCase.status === "UnderInvestigation") && (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <input
            value={resolutionSummary}
            onChange={(e) => setResolutionSummary(e.target.value)}
            placeholder="Resolution summary"
            className="input flex-1 basis-52"
          />
          <button
            type="button"
            disabled={!resolutionSummary}
            onClick={() => onResolve(grievanceCase.id, resolutionSummary)}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
          >
            Resolve
          </button>
        </div>
      )}

      {grievanceCase.status === "Resolved" && (
        <button
          type="button"
          onClick={() => onClose(grievanceCase.id)}
          className="mt-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
        >
          Close Case
        </button>
      )}
    </li>
  );
}
