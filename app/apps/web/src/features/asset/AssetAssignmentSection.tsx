import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import { assignAsset, listAllAssetAssignments, returnAsset } from "../../lib/api/assets";
import type { Asset } from "../../lib/api/types";
import { AssignmentRow } from "./AssignmentRow";

export function AssetAssignmentSection({ assets }: { assets: Asset[] }) {
  const queryClient = useQueryClient();
  const allAssignments = useQuery({ queryKey: ["asset-assignments-all"], queryFn: listAllAssetAssignments });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees });

  const [assignAssetId, setAssignAssetId] = useState("");
  const [assignEmployeeId, setAssignEmployeeId] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["assets"] });
    queryClient.invalidateQueries({ queryKey: ["asset-assignments-all"] });
    queryClient.invalidateQueries({ queryKey: ["asset-assignments-my"] });
  };

  const assignMutation = useMutation({
    mutationFn: () => assignAsset(assignAssetId, assignEmployeeId),
    onSuccess: () => {
      invalidate();
      setAssignAssetId("");
      setAssignEmployeeId("");
    },
  });

  const returnMutation = useMutation({
    mutationFn: ({ id, condition, notes }: { id: string; condition: string; notes?: string }) =>
      returnAsset(id, condition, notes),
    onSuccess: invalidate,
  });

  const assignError = assignMutation.error instanceof ApiError ? assignMutation.error.message : undefined;
  const availableAssets = assets.filter((a) => a.status === "Available");

  return (
    <>
      <Card title="Assign Asset">
        {assignError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{assignError}</p>}
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            assignMutation.mutate();
          }}
        >
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Available Asset</span>
            <select required value={assignAssetId} onChange={(e) => setAssignAssetId(e.target.value)} className="input">
              <option value="">Select asset</option>
              {availableAssets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.category}: {a.name} ({a.assetTag})
                </option>
              ))}
            </select>
          </label>
          <label className="block flex-1 basis-52">
            <span className="mb-1 block text-xs font-medium text-ink-muted">Employee</span>
            <select required value={assignEmployeeId} onChange={(e) => setAssignEmployeeId(e.target.value)} className="input">
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
            {assignMutation.isPending ? "Assigning…" : "Assign"}
          </button>
        </form>
      </Card>

      <Card title="All Assignments">
        {allAssignments.data?.length === 0 && <p className="text-ink-muted">No assignments yet.</p>}
        <ul className="space-y-2">
          {allAssignments.data?.map((assignment) => (
            <AssignmentRow
              key={assignment.id}
              assignment={assignment}
              showEmployee
              onReturn={(id, condition, notes) => returnMutation.mutate({ id, condition, notes })}
            />
          ))}
        </ul>
      </Card>
    </>
  );
}
