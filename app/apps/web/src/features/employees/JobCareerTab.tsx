import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listDepartments } from "../../lib/api/departments";
import { listEmployees } from "../../lib/api/employees";
import { createContractRenewal, createMovement, createProbation, decideProbation, getCareer } from "../../lib/api/people-extras";

const CHANGE_TYPES = ["Transfer", "Promotion", "Demotion", "Deputation", "Confirmation", "Other"];
const DECISIONS = ["Confirmed", "Failed", "Extended"];

/** Consolidates employment information (effective-dated history), promotion/demotion/transfer, and deputation/secondment. */
export function JobCareerTab({ employeeId, isAdmin }: { employeeId: string; isAdmin: boolean }) {
  const queryClient = useQueryClient();
  const career = useQuery({ queryKey: ["career", employeeId], queryFn: () => getCareer(employeeId) });
  const departments = useQuery({ queryKey: ["departments"], queryFn: listDepartments, enabled: isAdmin });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees, enabled: isAdmin });

  const [changeType, setChangeType] = useState("Transfer");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [toDepartmentId, setToDepartmentId] = useState("");
  const [toManagerId, setToManagerId] = useState("");
  const [reason, setReason] = useState("");

  const [probationStart, setProbationStart] = useState("");
  const [probationEnd, setProbationEnd] = useState("");

  const [newEndDate, setNewEndDate] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["career", employeeId] });
    queryClient.invalidateQueries({ queryKey: ["employees", employeeId] });
  };

  const movementMutation = useMutation({
    mutationFn: () =>
      createMovement(employeeId, {
        changeType,
        effectiveDate,
        toDepartmentId: toDepartmentId || undefined,
        toManagerId: toManagerId || undefined,
        reason: reason || undefined,
      }),
    onSuccess: () => {
      invalidate();
      setEffectiveDate("");
      setReason("");
    },
  });

  const probationMutation = useMutation({
    mutationFn: () => createProbation(employeeId, { startDate: probationStart, endDate: probationEnd }),
    onSuccess: () => {
      invalidate();
      setProbationStart("");
      setProbationEnd("");
    },
  });

  const decideMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: string }) => decideProbation(employeeId, id, { decision }),
    onSuccess: invalidate,
  });

  const renewalMutation = useMutation({
    mutationFn: () => createContractRenewal(employeeId, { newEndDate }),
    onSuccess: () => {
      invalidate();
      setNewEndDate("");
    },
  });

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Card title="Record a Movement">
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              movementMutation.mutate();
            }}
          >
            <select value={changeType} onChange={(e) => setChangeType(e.target.value)} className="input w-36">
              {CHANGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input required type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="input" />
            <select value={toDepartmentId} onChange={(e) => setToDepartmentId(e.target.value)} className="input">
              <option value="">Department unchanged</option>
              {departments.data?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select value={toManagerId} onChange={(e) => setToManagerId(e.target.value)} className="input">
              <option value="">Manager unchanged</option>
              {employees.data?.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.legalName}
                </option>
              ))}
            </select>
            <input placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} className="input flex-1 basis-40" />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover">
              Record
            </button>
          </form>
        </Card>
      )}

      <Card title="Assignment History">
        <ul className="space-y-1">
          {career.data?.assignmentHistory.map((m) => (
            <li key={m.id} className="rounded-lg border border-border p-2 text-sm">
              <span className="font-medium">{m.changeType}</span> · {new Date(m.effectiveDate).toLocaleDateString("en-IN")}
              {m.reason && <p className="mt-0.5 text-xs text-ink-faint">{m.reason}</p>}
            </li>
          ))}
          {career.data?.assignmentHistory.length === 0 && <p className="text-xs text-ink-faint">No movements recorded.</p>}
        </ul>
      </Card>

      <Card title="Probation">
        {isAdmin && (
          <form
            className="mb-3 flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              probationMutation.mutate();
            }}
          >
            <input required type="date" value={probationStart} onChange={(e) => setProbationStart(e.target.value)} className="input" />
            <input required type="date" value={probationEnd} onChange={(e) => setProbationEnd(e.target.value)} className="input" />
            <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
              Start Probation
            </button>
          </form>
        )}
        <ul className="space-y-1">
          {career.data?.probationRecords.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-sm">
              <span>
                {new Date(p.startDate).toLocaleDateString("en-IN")} – {new Date(p.endDate).toLocaleDateString("en-IN")}{" "}
                <Badge tone={p.status === "Confirmed" ? "positive" : p.status === "Failed" ? "negative" : "warning"}>{p.status}</Badge>
              </span>
              {isAdmin && (p.status === "OnProbation" || p.status === "Extended") && (
                <div className="flex gap-1">
                  {DECISIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => decideMutation.mutate({ id: p.id, decision: d })}
                      className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-surface-hover"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
          {career.data?.probationRecords.length === 0 && <p className="text-xs text-ink-faint">No probation record.</p>}
        </ul>
      </Card>

      <Card title="Contract Renewals">
        {isAdmin && (
          <form
            className="mb-3 flex flex-wrap items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              renewalMutation.mutate();
            }}
          >
            <input required type="date" value={newEndDate} onChange={(e) => setNewEndDate(e.target.value)} className="input" />
            <button type="submit" className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover">
              Renew Contract
            </button>
          </form>
        )}
        <ul className="space-y-1">
          {career.data?.contractRenewals.map((r) => (
            <li key={r.id} className="rounded-lg border border-border p-2 text-sm">
              Renewed to {new Date(r.newEndDate).toLocaleDateString("en-IN")}
              {r.note && <p className="mt-0.5 text-xs text-ink-faint">{r.note}</p>}
            </li>
          ))}
          {career.data?.contractRenewals.length === 0 && <p className="text-xs text-ink-faint">No renewals recorded.</p>}
        </ul>
      </Card>
    </div>
  );
}
