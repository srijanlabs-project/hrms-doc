import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import {
  addWorkerDocument,
  approveWorker,
  deactivateWorker,
  getWorker,
  reactivateWorker,
  rejectWorker,
  submitWorker,
  suspendWorker,
  verifyWorkerDocument,
} from "../../lib/api/contractor";
import { uploadFile } from "../../lib/api/files";
import { ApiError } from "../../lib/api/http";
import type { ExternalWorker } from "../../lib/api/types";
import { workerStatusTone } from "./status-tone";
import { WorkerActions } from "./WorkerActions";

const DOCUMENT_TYPES = ["NDA", "BackgroundCheck", "IdProof", "InsuranceCertificate", "Other"] as const;

/** Expandable worker row: shows contract/access details, compliance documents, and status-appropriate transition actions. */
export function WorkerCard({ worker }: { worker: ExternalWorker }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [documentType, setDocumentType] = useState<(typeof DOCUMENT_TYPES)[number]>("NDA");
  const [file, setFile] = useState<File | null>(null);

  const detail = useQuery({ queryKey: ["worker", worker.id], queryFn: () => getWorker(worker.id), enabled: expanded });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["worker", worker.id] });
    void queryClient.invalidateQueries({ queryKey: ["workers"] });
  };

  const submit = useMutation({ mutationFn: () => submitWorker(worker.id), onSuccess: invalidate });
  const approve = useMutation({ mutationFn: () => approveWorker(worker.id), onSuccess: invalidate });
  const reject = useMutation({ mutationFn: (reason: string) => rejectWorker(worker.id, reason), onSuccess: invalidate });
  const suspend = useMutation({ mutationFn: (reason: string) => suspendWorker(worker.id, reason), onSuccess: invalidate });
  const reactivate = useMutation({ mutationFn: () => reactivateWorker(worker.id), onSuccess: invalidate });
  const deactivate = useMutation({ mutationFn: () => deactivateWorker(worker.id), onSuccess: invalidate });
  const uploadDoc = useMutation({
    mutationFn: async () => {
      if (!file) return;
      const stored = await uploadFile(file);
      return addWorkerDocument(worker.id, { documentType, fileId: stored.id });
    },
    onSuccess: () => {
      invalidate();
      setFile(null);
    },
  });
  const verifyDoc = useMutation({ mutationFn: (documentId: string) => verifyWorkerDocument(documentId), onSuccess: invalidate });

  const errorMessage = [submit, approve, reject, suspend, reactivate, deactivate, uploadDoc]
    .map((m) => m.error)
    .find((e) => e instanceof ApiError)?.message;

  return (
    <li className="rounded-lg border border-border p-3">
      <button type="button" className="flex w-full items-center justify-between text-left" onClick={() => setExpanded((v) => !v)}>
        <span>
          <span className="font-medium">{worker.fullName}</span>
          <span className="ml-2 text-xs text-ink-faint">
            {worker.vendor.name} · {worker.category}
          </span>
        </span>
        <Badge tone={workerStatusTone(worker.status)}>{worker.status}</Badge>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3 border-t border-border pt-3">
          {errorMessage && <p className="rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
          <p className="text-xs text-ink-faint">
            Contract {new Date(worker.contractStartDate).toLocaleDateString("en-IN")} –{" "}
            {new Date(worker.contractEndDate).toLocaleDateString("en-IN")}
            {worker.accessGrantedAt && ` · Access granted ${new Date(worker.accessGrantedAt).toLocaleDateString("en-IN")}`}
            {worker.accessRevokedAt && ` · Access revoked ${new Date(worker.accessRevokedAt).toLocaleDateString("en-IN")}`}
          </p>

          <ul className="space-y-1.5">
            {detail.data?.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg bg-canvas p-2 text-sm">
                <span>{d.documentType}</span>
                {d.isVerified ? (
                  <Badge tone="positive">Verified</Badge>
                ) : (
                  <button
                    type="button"
                    disabled={verifyDoc.isPending}
                    onClick={() => verifyDoc.mutate(d.id)}
                    className="rounded-lg border border-border px-2 py-0.5 text-xs font-medium hover:border-primary disabled:opacity-60"
                  >
                    Verify
                  </button>
                )}
              </li>
            ))}
            {detail.data?.documents.length === 0 && <p className="text-xs text-ink-faint">No compliance documents uploaded.</p>}
          </ul>

          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              uploadDoc.mutate();
            }}
          >
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value as typeof documentType)} className="input w-40">
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" />
            <button
              type="submit"
              disabled={!file || uploadDoc.isPending}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary disabled:opacity-60"
            >
              Upload
            </button>
          </form>

          <WorkerActions
            worker={worker}
            submit={submit}
            approve={approve}
            reject={(reason) => reject.mutate(reason)}
            suspend={(reason) => suspend.mutate(reason)}
            reactivate={reactivate}
            deactivate={deactivate}
          />
        </div>
      )}
    </li>
  );
}
