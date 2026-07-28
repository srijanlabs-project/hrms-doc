import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { listEmployees } from "../../lib/api/employees";
import { cancelEsopGrant, createEsopGrant, listAllEsopGrants } from "../../lib/api/esop";
import { ApiError } from "../../lib/api/http";

function EsopGrantForm() {
  const queryClient = useQueryClient();
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [employeeId, setEmployeeId] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [grantDate, setGrantDate] = useState("");
  const [vestingStartDate, setVestingStartDate] = useState("");
  const [vestingYears, setVestingYears] = useState("4");
  const [cliffMonths, setCliffMonths] = useState("12");

  const create = useMutation({
    mutationFn: () =>
      createEsopGrant({
        employeeId,
        totalUnits: Number(totalUnits),
        grantDate,
        vestingStartDate,
        vestingYears: Number(vestingYears),
        cliffMonths: Number(cliffMonths),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["esop-grants-admin"] });
      setEmployeeId("");
      setTotalUnits("");
      setGrantDate("");
      setVestingStartDate("");
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <>
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
          <select required value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input">
            <option value="">Select employee</option>
            {employees.data?.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.legalName} ({emp.employeeCode})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Total Units</span>
          <input
            required
            type="number"
            min="1"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            className="input w-28"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Grant Date</span>
          <input required type="date" value={grantDate} onChange={(e) => setGrantDate(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Vesting Start</span>
          <input
            required
            type="date"
            value={vestingStartDate}
            onChange={(e) => setVestingStartDate(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Years</span>
          <input
            required
            type="number"
            min="1"
            max="10"
            value={vestingYears}
            onChange={(e) => setVestingYears(e.target.value)}
            className="input w-20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Cliff (mo)</span>
          <input
            required
            type="number"
            min="0"
            max="60"
            value={cliffMonths}
            onChange={(e) => setCliffMonths(e.target.value)}
            className="input w-20"
          />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Granting…" : "Grant"}
        </button>
      </form>
    </>
  );
}

/** Admin: grant ESOP units to an employee and review/cancel existing grants. Exercise/transaction tracking is out of scope. */
export function EsopAdminPanel() {
  const queryClient = useQueryClient();
  const grants = useQuery({ queryKey: ["esop-grants-admin"], queryFn: listAllEsopGrants });
  const cancel = useMutation({
    mutationFn: (id: string) => cancelEsopGrant(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["esop-grants-admin"] }),
  });

  return (
    <Card title="ESOP Grants (Admin)">
      <EsopGrantForm />

      <ul className="space-y-2">
        {grants.data?.map((g) => (
          <li key={g.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {g.employee.legalName} — {g.totalUnits.toLocaleString("en-IN")} units
              </span>
              <Badge tone={g.status === "Active" ? "positive" : "neutral"}>{g.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              {g.vestedUnits.toLocaleString("en-IN")} vested · Granted {new Date(g.grantDate).toLocaleDateString("en-IN")}
            </p>
            {g.status === "Active" && (
              <button
                type="button"
                disabled={cancel.isPending}
                onClick={() => cancel.mutate(g.id)}
                className="mt-2 rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
              >
                Cancel
              </button>
            )}
          </li>
        ))}
        {grants.data?.length === 0 && <p className="text-ink-muted">No ESOP grants yet.</p>}
      </ul>
    </Card>
  );
}
