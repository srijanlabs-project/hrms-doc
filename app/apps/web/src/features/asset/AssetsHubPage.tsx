import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { useAuth } from "../auth/AuthProvider";
import { ApiError } from "../../lib/api/http";
import { listEmployees } from "../../lib/api/employees";
import {
  assignAsset,
  createAsset,
  listAllAssetAssignments,
  listAssets,
  listMyAssetAssignments,
  returnAsset,
} from "../../lib/api/assets";
import { AssetRow } from "./AssetRow";
import { AssignmentRow } from "./AssignmentRow";

const ASSET_CATEGORIES = ["Laptop", "Phone", "Monitor", "SimCard", "IdCard", "Peripheral", "PPE", "Other"];
const ADMIN_ROLES = ["org_admin", "hr_ops"];

/** T-005 Smart Form -> Asset Assignment/Return, v1 slice. See schema.prisma's Asset/AssetAssignment comments for what's deferred. */
export function AssetsHubPage() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.some((role) => user?.roles.includes(role));
  const queryClient = useQueryClient();

  const myAssignments = useQuery({ queryKey: ["asset-assignments-my"], queryFn: listMyAssetAssignments });
  const assets = useQuery({ queryKey: ["assets"], queryFn: listAssets, enabled: isAdmin });
  const allAssignments = useQuery({ queryKey: ["asset-assignments-all"], queryFn: listAllAssetAssignments, enabled: isAdmin });
  const employees = useQuery({ queryKey: ["employees"], queryFn: listEmployees, enabled: isAdmin });

  const [assetTag, setAssetTag] = useState("");
  const [category, setCategory] = useState("Laptop");
  const [name, setName] = useState("");
  const [assignAssetId, setAssignAssetId] = useState("");
  const [assignEmployeeId, setAssignEmployeeId] = useState("");

  const invalidateAssets = () => queryClient.invalidateQueries({ queryKey: ["assets"] });
  const invalidateAssignments = () => {
    queryClient.invalidateQueries({ queryKey: ["asset-assignments-all"] });
    queryClient.invalidateQueries({ queryKey: ["asset-assignments-my"] });
  };

  const createAssetMutation = useMutation({
    mutationFn: () => createAsset({ assetTag: assetTag || undefined, category, name }),
    onSuccess: () => {
      invalidateAssets();
      setAssetTag("");
      setName("");
    },
  });

  const assignMutation = useMutation({
    mutationFn: () => assignAsset(assignAssetId, assignEmployeeId),
    onSuccess: () => {
      invalidateAssets();
      invalidateAssignments();
      setAssignAssetId("");
      setAssignEmployeeId("");
    },
  });

  const returnMutation = useMutation({
    mutationFn: ({ id, condition, notes }: { id: string; condition: string; notes?: string }) =>
      returnAsset(id, condition, notes),
    onSuccess: () => {
      invalidateAssets();
      invalidateAssignments();
    },
  });

  const createError = createAssetMutation.error instanceof ApiError ? createAssetMutation.error.message : undefined;
  const assignError = assignMutation.error instanceof ApiError ? assignMutation.error.message : undefined;
  const availableAssets = assets.data?.filter((a) => a.status === "Available") ?? [];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Assets</h1>
        <p className="text-ink-muted">Track company assets assigned to you and, for admins, the full catalog.</p>
      </header>

      <Card title="My Assets">
        {myAssignments.data?.length === 0 && <p className="text-ink-muted">No assets currently assigned to you.</p>}
        <ul className="space-y-2">
          {myAssignments.data?.map((assignment) => (
            <AssignmentRow key={assignment.id} assignment={assignment} />
          ))}
        </ul>
      </Card>

      {isAdmin && (
        <>
          <Card title="Asset Catalog">
            {createError && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{createError}</p>}
            <form
              className="mb-4 flex flex-wrap items-end gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                createAssetMutation.mutate();
              }}
            >
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Asset Tag</span>
                <input
                  placeholder="Auto-generated if blank"
                  value={assetTag}
                  onChange={(e) => setAssetTag(e.target.value)}
                  className="input w-36"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Category</span>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="input w-36">
                  {ASSET_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block flex-1 basis-52">
                <span className="mb-1 block text-xs font-medium text-ink-muted">Name</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
              </label>
              <button
                type="submit"
                disabled={createAssetMutation.isPending}
                className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
              >
                {createAssetMutation.isPending ? "Adding…" : "Add Asset"}
              </button>
            </form>
            <ul className="space-y-2">
              {assets.data?.map((asset) => (
                <AssetRow key={asset.id} asset={asset} />
              ))}
            </ul>
          </Card>

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
                <select
                  required
                  value={assignAssetId}
                  onChange={(e) => setAssignAssetId(e.target.value)}
                  className="input"
                >
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
                <select
                  required
                  value={assignEmployeeId}
                  onChange={(e) => setAssignEmployeeId(e.target.value)}
                  className="input"
                >
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
      )}
    </div>
  );
}
