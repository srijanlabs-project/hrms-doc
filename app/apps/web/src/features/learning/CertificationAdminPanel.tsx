import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";
import { ApiError } from "../../lib/api/http";
import {
  createCertificationCatalogEntry,
  listAllCertificationRecords,
  listCertificationCatalog,
  revokeCertificationRecord,
  verifyCertificationRecord,
} from "../../lib/api/learning";
import { certificationStatusTone } from "./status-tone";

function CatalogForm() {
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [validityMonths, setValidityMonths] = useState("");
  const [isMandatory, setIsMandatory] = useState(false);

  const create = useMutation({
    mutationFn: () =>
      createCertificationCatalogEntry({
        code,
        name,
        issuer: issuer || undefined,
        validityMonths: validityMonths ? Number(validityMonths) : undefined,
        isMandatory,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["certification-catalog"] });
      setCode("");
      setName("");
      setIssuer("");
      setValidityMonths("");
      setIsMandatory(false);
    },
  });
  const errorMessage = create.error instanceof ApiError ? create.error.message : undefined;

  return (
    <form
      className="mb-4 flex flex-wrap items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
    >
      {errorMessage && <p className="w-full rounded-lg bg-negative-soft px-3 py-2 text-negative">{errorMessage}</p>}
      <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="input w-28" />
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input w-48" />
      <input value={issuer} onChange={(e) => setIssuer(e.target.value)} placeholder="Issuer" className="input w-36" />
      <input
        type="number"
        value={validityMonths}
        onChange={(e) => setValidityMonths(e.target.value)}
        placeholder="Validity (months)"
        className="input w-32"
      />
      <label className="flex items-center gap-1 text-xs">
        <input type="checkbox" checked={isMandatory} onChange={(e) => setIsMandatory(e.target.checked)} />
        Mandatory
      </label>
      <button
        type="submit"
        disabled={create.isPending}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:border-primary disabled:opacity-60"
      >
        Add to Catalog
      </button>
    </form>
  );
}

const STATUSES = ["All", "Active", "Expiring", "Expired", "Revoked"] as const;

/** Admin: certification catalog management + all-employees record review (verify/revoke). */
export function CertificationAdminPanel() {
  const queryClient = useQueryClient();
  const catalog = useQuery({ queryKey: ["certification-catalog"], queryFn: listCertificationCatalog });
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("All");
  const records = useQuery({
    queryKey: ["certification-records", filter],
    queryFn: () => listAllCertificationRecords(filter === "All" ? undefined : filter),
  });

  const [revokeReason, setRevokeReason] = useState<Record<string, string>>({});
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["certification-records"] });
  const verify = useMutation({ mutationFn: (id: string) => verifyCertificationRecord(id), onSuccess: invalidate });
  const revoke = useMutation({
    mutationFn: (id: string) => revokeCertificationRecord(id, revokeReason[id] ?? ""),
    onSuccess: invalidate,
  });

  return (
    <Card title="Certification Catalog & Records">
      <h3 className="mb-2 text-sm font-semibold">Catalog ({catalog.data?.length ?? 0})</h3>
      <CatalogForm />

      <h3 className="mb-2 mt-4 text-sm font-semibold">Employee Records</h3>
      <div className="mb-3 flex gap-1 border-b border-border">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium ${filter === s ? "border-b-2 border-primary text-primary" : "text-ink-muted"}`}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {records.data?.map((r) => (
          <li key={r.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {r.employee.legalName} — {r.certification.name}
              </span>
              <Badge tone={certificationStatusTone(r.status)}>{r.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-faint">
              Issued {new Date(r.issueDate).toLocaleDateString("en-IN")}
              {r.expiryDate && ` · Expires ${new Date(r.expiryDate).toLocaleDateString("en-IN")}`}
            </p>
            {r.status !== "Revoked" && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {!r.verifiedAt && (
                  <button
                    type="button"
                    disabled={verify.isPending}
                    onClick={() => verify.mutate(r.id)}
                    className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-primary disabled:opacity-60"
                  >
                    Verify
                  </button>
                )}
                <input
                  value={revokeReason[r.id] ?? ""}
                  onChange={(e) => setRevokeReason((prev) => ({ ...prev, [r.id]: e.target.value }))}
                  placeholder="Revoke reason"
                  className="input w-48 text-xs"
                />
                <button
                  type="button"
                  disabled={revoke.isPending || !(revokeReason[r.id] ?? "").trim()}
                  onClick={() => revoke.mutate(r.id)}
                  className="rounded-lg border border-border px-3 py-1 text-xs font-medium hover:border-negative hover:text-negative disabled:opacity-60"
                >
                  Revoke
                </button>
              </div>
            )}
          </li>
        ))}
        {records.data?.length === 0 && <p className="text-ink-muted">No records match this filter.</p>}
      </ul>
    </Card>
  );
}
