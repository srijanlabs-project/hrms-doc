import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  cancelMaintenanceRecord,
  completeMaintenanceRecord,
  createMaintenanceRecord,
  listAllMaintenanceRecords,
} from "../../lib/api/asset-maintenance";
import type { Asset } from "../../lib/api/types";

const MAINTENANCE_TYPES = ["Preventive", "Repair", "Inspection"];

function maintenanceTone(status: string): "warning" | "positive" | "neutral" {
  if (status === "Completed") return "positive";
  if (status === "Cancelled") return "neutral";
  return "warning";
}

/** Wave 4·E18 gap closure ("asset maintenance"). Admin-only — mirrors the Asset Catalog card above. */
export function MaintenancePanel({ assets }: { assets: Asset[] }) {
  const queryClient = useQueryClient();
  const records = useQuery({ queryKey: ["asset-maintenance"], queryFn: listAllMaintenanceRecords });

  const [assetId, setAssetId] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("Preventive");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["asset-maintenance"] });
    queryClient.invalidateQueries({ queryKey: ["assets"] });
  };

  const createMutation = useMutation({
    mutationFn: () => createMaintenanceRecord({ assetId, maintenanceType, description, scheduledDate }),
    onSuccess: () => {
      invalidate();
      setDescription("");
      setScheduledDate("");
    },
  });
  const completeMutation = useMutation({ mutationFn: (id: string) => completeMaintenanceRecord(id), onSuccess: invalidate });
  const cancelMutation = useMutation({ mutationFn: (id: string) => cancelMaintenanceRecord(id), onSuccess: invalidate });

  const errorMessage = createMutation.error instanceof ApiError ? createMutation.error.message : undefined;
  const eligibleAssets = assets.filter((a) => a.status !== "Retired" && a.status !== "UnderRepair");

  return (
    <Card title="Asset Maintenance">
      {errorMessage && <p className="mb-2 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          createMutation.mutate();
        }}
      >
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Asset</span>
          <select required value={assetId} onChange={(e) => setAssetId(e.target.value)} className="input">
            <option value="">Select asset</option>
            {eligibleAssets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.category}: {a.name} ({a.assetTag})
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Type</span>
          <select value={maintenanceType} onChange={(e) => setMaintenanceType(e.target.value)} className="input w-36">
            {MAINTENANCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Scheduled Date</span>
          <input
            required
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="input"
          />
        </label>
        <label className="block flex-1 basis-52">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Description</span>
          <input required value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </label>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
        >
          {createMutation.isPending ? "Logging…" : "Log Maintenance"}
        </button>
      </form>

      <ul className="space-y-2">
        {records.data?.map((record) => (
          <li key={record.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {record.asset.category}: {record.asset.name} ({record.asset.assetTag})
                </span>{" "}
                <Badge tone={maintenanceTone(record.status)}>{record.status}</Badge>
                <p className="mt-1 text-xs text-ink-faint">
                  {record.maintenanceType} · Scheduled {new Date(record.scheduledDate).toLocaleDateString("en-IN")}
                </p>
                <p className="mt-1 text-xs text-ink-faint">{record.description}</p>
              </div>
              {record.status === "Scheduled" && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => completeMutation.mutate(record.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover"
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => cancelMutation.mutate(record.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-surface-hover"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
        {records.data?.length === 0 && <p className="text-ink-muted">No maintenance records yet.</p>}
      </ul>
    </Card>
  );
}
