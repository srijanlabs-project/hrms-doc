import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { listVendors, listWorkers, runExpirySweepNow } from "../../lib/api/contractor";
import { CreateWorkerForm } from "./CreateWorkerForm";
import { WorkerCard } from "./WorkerCard";

const STATUSES = ["All", "Draft", "PendingApproval", "Active", "Expired", "Suspended", "Inactive"] as const;

/** External worker roster: create, filter by status, and manage each through its approve/suspend/expire lifecycle. */
export function WorkerPanel() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const vendors = useQuery({ queryKey: ["vendors"], queryFn: listVendors });
  const workers = useQuery({
    queryKey: ["workers", status],
    queryFn: () => listWorkers(status === "All" ? undefined : status),
  });
  const sweep = useMutation({ mutationFn: runExpirySweepNow });

  return (
    <Card title="External Workers">
      <CreateWorkerForm vendors={vendors.data} />

      <div className="mb-3 flex items-center gap-2">
        <select value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className="input">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={sweep.isPending}
          onClick={() => sweep.mutate()}
          className="ml-auto rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          {sweep.isPending ? "Running…" : "Run Contract-Expiry Sweep Now"}
        </button>
      </div>

      <ul className="space-y-2">
        {workers.data?.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
        {workers.data?.length === 0 && <p className="text-ink-muted">No external workers match this filter.</p>}
      </ul>
    </Card>
  );
}
