import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import { assignLicense, listActiveLicenses } from "../../lib/api/software-license";

export function AssignLicenseForm() {
  const queryClient = useQueryClient();
  const licenses = useQuery({ queryKey: ["licenses-active"], queryFn: listActiveLicenses });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [licenseId, setLicenseId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const assignMutation = useMutation({
    mutationFn: () => assignLicense(licenseId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses-all"] });
      queryClient.invalidateQueries({ queryKey: ["licenses-active"] });
      queryClient.invalidateQueries({ queryKey: ["license-assignments-all"] });
      setLicenseId("");
      setEmployeeId("");
    },
  });
  const errorMessage = assignMutation.error instanceof ApiError ? assignMutation.error.message : undefined;

  const availableLicenses = licenses.data?.filter((l) => l.seatsUsed < l.totalSeats) ?? [];

  return (
    <>
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          assignMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">License</span>
          <select required value={licenseId} onChange={(e) => setLicenseId(e.target.value)} className="input">
            <option value="">Select license</option>
            {availableLicenses.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.seatsUsed}/{l.totalSeats} seats used)
              </option>
            ))}
          </select>
        </label>
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
        <button
          type="submit"
          disabled={assignMutation.isPending}
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {assignMutation.isPending ? "Assigning…" : "Assign Seat"}
        </button>
      </form>
    </>
  );
}
