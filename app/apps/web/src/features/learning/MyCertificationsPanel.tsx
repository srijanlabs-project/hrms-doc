import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { fileDownloadUrl, uploadFile } from "../../lib/api/files";
import { ApiError } from "../../lib/api/http";
import { createCertificationRecord, listCertificationCatalog, listMyCertifications } from "../../lib/api/learning";
import { certificationStatusTone } from "./status-tone";

/** Self-service: add a certification record for yourself and view your own certification profile. */
export function MyCertificationsPanel() {
  const queryClient = useQueryClient();
  const catalog = useQuery({ queryKey: ["certification-catalog"], queryFn: listCertificationCatalog });
  const records = useQuery({ queryKey: ["certifications-my"], queryFn: listMyCertifications });

  const [catalogId, setCatalogId] = useState("");
  const [certificateNumber, setCertificateNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const create = useMutation({
    mutationFn: async () => {
      const evidenceFileId = file ? (await uploadFile(file)).id : undefined;
      return createCertificationRecord({ certificationCatalogId: catalogId, certificateNumber: certificateNumber || undefined, issueDate, evidenceFileId });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["certifications-my"] });
      setCatalogId("");
      setCertificateNumber("");
      setIssueDate("");
      setFile(null);
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <Card title="My Certifications">
      {errorMessage && <p className="mb-3 rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <form
        className="mb-4 flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Certification</span>
          <select required value={catalogId} onChange={(e) => setCatalogId(e.target.value)} className="input w-56">
            <option value="">Select…</option>
            {catalog.data?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {c.isMandatory ? " (Mandatory)" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Certificate No.</span>
          <input value={certificateNumber} onChange={(e) => setCertificateNumber(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Issue Date</span>
          <input required type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-ink-muted">Evidence (optional)</span>
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="text-xs" />
        </label>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
        >
          {create.isPending ? "Saving…" : "Add Certification"}
        </button>
      </form>

      <ul className="space-y-2">
        {records.data?.map((r) => (
          <li key={r.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{r.certification.name}</span>
              <Badge tone={certificationStatusTone(r.status)}>{r.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Issued {new Date(r.issueDate).toLocaleDateString("en-IN")}
              {r.expiryDate && ` · Expires ${new Date(r.expiryDate).toLocaleDateString("en-IN")}`}
              {r.verifiedAt && " · Verified"}
            </p>
            {r.evidenceFileId && (
              <a href={fileDownloadUrl(r.evidenceFileId)} target="_blank" rel="noreferrer" className="mt-1 block text-xs text-primary hover:underline">
                View evidence
              </a>
            )}
            {r.revokedReason && <p className="mt-1 text-xs text-negative">Revoked: {r.revokedReason}</p>}
          </li>
        ))}
        {records.data?.length === 0 && <p className="text-ink-muted">You have no certification records yet.</p>}
      </ul>
    </Card>
  );
}
