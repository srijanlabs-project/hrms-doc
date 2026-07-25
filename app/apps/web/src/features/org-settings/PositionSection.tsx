import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { ApiError } from "../../lib/api/http";
import { listDepartments } from "../../lib/api/departments";
import { createPosition, listDesignations, listPositions, updatePositionStatus } from "../../lib/api/org-settings";

const STATUSES = ["Open", "Filled", "Frozen", "Closed"];

function statusTone(status: string) {
  if (status === "Open") return "positive" as const;
  if (status === "Filled") return "info" as const;
  if (status === "Frozen") return "warning" as const;
  return "negative" as const;
}

/** Position management — no dedicated spec, modeled as a budgeted seat in a department that an employee may occupy. */
export function PositionSection() {
  const queryClient = useQueryClient();
  const positions = useQuery({ queryKey: ["positions"], queryFn: listPositions });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments });
  const designations = useQuery({ queryKey: ["designations"], queryFn: listDesignations });

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [designationId, setDesignationId] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["positions"] });

  const createMutation = useMutation({
    mutationFn: () => createPosition({ code, title, departmentId, designationId: designationId || undefined }),
    onSuccess: () => {
      invalidate();
      setCode("");
      setTitle("");
      setDepartmentId("");
      setDesignationId("");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updatePositionStatus(id, status),
    onSuccess: invalidate,
  });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;

  return (
    <Card title="Positions">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Code</span>
          <input required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="input w-32" />
        </label>
        <label className="block flex-1 basis-40">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Department</span>
          <select required value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="input">
            <option value="">Select</option>
            {departments.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block flex-1 basis-32">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Designation</span>
          <select value={designationId} onChange={(e) => setDesignationId(e.target.value)} className="input">
            <option value="">None</option>
            {designations.data?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {createMutation.isPending ? "Adding…" : "Add Position"}
        </button>
      </form>
      <ul className="space-y-2">
        {positions.data?.map((p) => (
          <li key={p.id} className="rounded-lg border border-border p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{p.title}</span> <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {p.department.name}
                  {p.designation && ` · ${p.designation.title}`}
                  {p.employees.length > 0 && ` · Occupied by ${p.employees.map((e) => e.legalName).join(", ")}`}
                </p>
              </div>
              <select
                value={p.status}
                onChange={(e) => statusMutation.mutate({ id: p.id, status: e.target.value })}
                className="input w-28 text-xs"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
