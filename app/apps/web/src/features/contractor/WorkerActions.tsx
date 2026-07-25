import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import type { ExternalWorker } from "../../lib/api/types";

interface WorkerActionsProps {
  worker: ExternalWorker;
  submit: UseMutationResult<ExternalWorker, unknown, void>;
  approve: UseMutationResult<ExternalWorker, unknown, void>;
  reject: (reason: string) => void;
  suspend: (reason: string) => void;
  reactivate: UseMutationResult<ExternalWorker, unknown, void>;
  deactivate: UseMutationResult<ExternalWorker, unknown, void>;
}

/** Status-appropriate transition controls for a worker — extracted from WorkerCard to stay under the per-function line limit. */
export function WorkerActions({ worker, submit, approve, reject, suspend, reactivate, deactivate }: WorkerActionsProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-2">
      {worker.status === "Draft" && (
        <button
          type="button"
          disabled={submit.isPending}
          onClick={() => submit.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Submit for Approval
        </button>
      )}
      {worker.status === "PendingApproval" && (
        <>
          <button
            type="button"
            disabled={approve.isPending}
            onClick={() => approve.mutate()}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
          >
            Approve
          </button>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Rejection reason" className="input w-40" />
          <button
            type="button"
            disabled={!reason}
            onClick={() => reject(reason)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Reject
          </button>
        </>
      )}
      {worker.status === "Active" && (
        <>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Suspension reason" className="input w-40" />
          <button
            type="button"
            disabled={!reason}
            onClick={() => suspend(reason)}
            className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
          >
            Suspend
          </button>
        </>
      )}
      {worker.status === "Suspended" && (
        <button
          type="button"
          disabled={reactivate.isPending}
          onClick={() => reactivate.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
        >
          Reactivate
        </button>
      )}
      {(worker.status === "Active" || worker.status === "Expired" || worker.status === "Suspended") && (
        <button
          type="button"
          disabled={deactivate.isPending}
          onClick={() => deactivate.mutate()}
          className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
        >
          Deactivate
        </button>
      )}
      {worker.statusReason && <span className="text-xs text-ink-faint">Reason: {worker.statusReason}</span>}
    </div>
  );
}
